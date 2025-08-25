const { createOffer } = require("./offerController.js");
const Offer = require("../models/offerModel");
const Product = require("../models/product");

// Mock Express req, res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock("../models/offerModel");   // mock Offer model
jest.mock("../models/product");      // mock Product model

describe("createOffer Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        categoryName: "Electronics",
        product: "product123",
        minPurchase: 1000,
        discount: 10,
        description: "Special Discount",
        createdBySeller: "seller123",
      },
    };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("should return 400 if required fields are missing", async () => {
    req.body = {}; // empty body
    await createOffer(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Please provide all required fields" })
    );
  });

  test("should return 400 if product not found", async () => {
    Product.findById.mockResolvedValue(null);

    await createOffer(req, res);

    expect(Product.findById).toHaveBeenCalledWith("product123");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Product not found" })
    );
  });

  test("should return 400 if product category mismatch", async () => {
    Product.findById.mockResolvedValue({ _id: "product123", category: "OtherCategory", productName: "Phone" });

    await createOffer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Product does not belong to selected category" })
    );
  });

  test("should create offer successfully", async () => {
    const mockProduct = { _id: "product123", category: "Electronics", productName: "Phone" };
    const mockSavedOffer = { _id: "offer123", ...req.body };

    Product.findById.mockResolvedValue(mockProduct);
    Offer.prototype.save = jest.fn().mockResolvedValue(mockSavedOffer);

    await createOffer(req, res);

    expect(Product.findById).toHaveBeenCalledWith("product123");
    expect(Offer.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, offer: mockSavedOffer });
  });

  test("should return 500 on server error", async () => {
    Product.findById.mockRejectedValue(new Error("DB error"));

    await createOffer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Error creating offer" })
    );
  });
});
