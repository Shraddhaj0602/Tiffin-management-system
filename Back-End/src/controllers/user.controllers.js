import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();

    user.refreshToken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something Went Wrong While Generating Refresh and Access Token",
      error
    );
  }
};

const registerUser = asyncHandler(async function (req, res) {
  const { FullName, username, password, email, address } = req.body;
  if (
    [FullName, username, password, email, address].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists by email or username
  const existedUser = await User.find({ $or: [{ username }, { email }] });
  if (existedUser.length > 0) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Proceed with user creation
  const user = await User.create({
    FullName,
    username,
    password,
    email,
    address,
  });

  // Omit sensitive fields from the response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // Get the data from the User
  // Check the data is correct or Not
  // Check if the user is registred or not
  // Match the data of the User
  // Redirection on sucessfull Login
  // Create a access token
  // Create a refesh token

  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "UserName or Password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User Does Not Exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { accessToken, refreshtoken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshtoken)
    .json(
      new ApiResponse(
        200,
        200,
        {
          loggedInUser,
          accessToken,
          refreshtoken,
        },
        "User logged In Successfully"
      )
    );
});
const getdata = asyncHandler(async (req, res) => {
  return res.json(req.user);
});
const logoutUser = asyncHandler(async (req, res) => {
  console.log(req);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refeshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded?._id);
    if (!user) {
      throw (new ApiError(401), "Invalid Refresh Token ");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw (new ApiError(401), "Invalid Refresh Token ");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshtoken } = await generateAccessAndRefereshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshtoken)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshtoken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh token");
  }
});

export { registerUser, loginUser, logoutUser, getdata };
