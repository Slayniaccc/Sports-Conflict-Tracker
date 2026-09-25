package com.slayniaccc.sportsconflicttracker.client;

public class BallDontLieException extends RuntimeException {
    public BallDontLieException(String message) { super(message); }
    public BallDontLieException(String message, Throwable cause) { super(message, cause); }
}