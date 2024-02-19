const expressValidator = require("express-validator");
const randtoken = require('rand-token');

const authController = require("../../../controllers/api/authController");
const { sendMail } = require("../../../services/emailService");
const userService = require("../../../services/userService");

jest.mock("../../../services/userService", () => ({
    create: jest.fn(),
    findOne: jest.fn(() => { }),
    findOneAndUpdate: jest.fn()
}));

jest.mock("../../../services/emailService", () => ({
    sendMail: jest.fn()
}));

jest.mock("express-validator", () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => {
            return false;
        }),
        array: jest.fn(() => {
            return [{msg: "Invalid field"}];
        })
    }))
}));

jest.mock("rand-token", () => ({
    generate: jest.fn((password) => `hashed_${password}`)
}));

afterEach(() => {
    jest.restoreAllMocks();
});

describe("Register User", () => {
    it("should throw 422 when there are errors", async() => {
        let mockRequest = {
            body: {
                fullName: "",
                email: "",
                password: ""
            }
        };
        let mockResponse = {
            setHeader: jest.fn(),
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        await authController.registerUser(mockRequest, mockResponse, jest.fn);
        expect(mockResponse.setHeader).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(422);
        expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid field" }]);
    });

    it("should create new user on successful registration", async() => {
        jest.spyOn(expressValidator, "validationResult").mockImplementationOnce(() => ({
			isEmpty: jest.fn(() => true),
		}));

        let mockRequest = {
            body: {
                fullName: "Full name",
                email: "test@example.com",
                password: "password"
            }
        };
        let mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn()
        };
        await authController.registerUser(mockRequest, mockResponse, jest.fn);
        expect(userService.create).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({"message": "User created successsfully. Please check your email for token to verify your account."});

    });

    it("should call sendMail function to send email on successful registration", async () => {
        jest.spyOn(expressValidator, "validationResult").mockImplementationOnce(() => ({
			isEmpty: jest.fn(() => true),
		}));

        let mockRequest = {
            body: {
                fullName: "Full name",
                email: "test@example.com",
                password: "password"
            }
        };
        let mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn()
        };
        await authController.registerUser(mockRequest, mockResponse, jest.fn);
        expect(sendMail).toHaveBeenCalled();
    });

    it("should throw 500 if user is unable to save to database", async () => {
        jest.spyOn(expressValidator, "validationResult").mockImplementationOnce(() => ({
			isEmpty: jest.fn(() => true),
        }));

        jest.spyOn(userService, "create").mockImplementationOnce(() => {throw new Error("error")});

        let mockRequest = {
            body: {
                fullName: "Full name",
                email: "test@example.com",
                password: "password"
            }
        };
        let mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn()
        };
        const nextCallback = jest.fn();
        await authController.registerUser(mockRequest, mockResponse, nextCallback);
        expect(nextCallback).toHaveBeenCalled();
    })
});

describe("Activate User", () => {
    it("should throw 400 when no token is provided", async() => {
        let mockRequest = {
            params: {
                token: "",
            }
        };
        let mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        await authController.activateUser(mockRequest, mockResponse, jest.fn);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({"error": "Token is required"});
    });

    it("should throw 400 when token is not valid", async() => {
        let mockRequest = {
            params: {
                token: "token",
            }
        };
        let mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        await authController.activateUser(mockRequest, mockResponse, jest.fn);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({"error": "Token is invalid"});
    });

    it("should throw 400 when token is expired", async () => {
        jest.spyOn(userService, "findOne").mockImplementationOnce(() => {
            return {
                tokenExpiry: new Date().getTime() - 10000
            }
        });

        let mockRequest = {
            params: {
                token: "token",
            }
        };
        let mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        await authController.activateUser(mockRequest, mockResponse, jest.fn);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({"error": "Token is expired"});
    });

    it("should activate user and send 200 on valid token", async() => {
        jest.spyOn(userService, "findOne").mockImplementationOnce(() => {
            return {
                tokenExpiry: new Date().getTime() + 10000
            }
        });

        let mockRequest = {
            params: {
                token: "token",
            }
        };
        let mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        await authController.activateUser(mockRequest, mockResponse, jest.fn);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith({"message": "Your account is activated. Please login to continue."});
    });

    it("should throw 500 if any server error occured", async() => {
        jest.spyOn(userService, "findOne").mockImplementationOnce(() => {
            throw new Error("error");
        });

        let mockRequest = {
            params: {
                token: "token",
            }
        };
        let mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn()
        };
        let mockNextFn = jest.fn();
        await authController.activateUser(mockRequest, mockResponse, mockNextFn);
        expect(mockNextFn).toHaveBeenCalled();
    });
});