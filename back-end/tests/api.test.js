const request = require("supertest");
const app = require("../app");
const { sequelize, Category, Brand, Product, User, Role } = require("../models");

let userToken;
let testProduct;
let testCategory;
let testBrand;

beforeAll(async () => {
    await sequelize.sync();
    console.log("Database synced for tests");

    const initResponse = await request(app).post("/init");
    console.log("Init Response:", initResponse.body); // Debug
    expect(initResponse.statusCode).toBe(200);

    console.log("Database initialized successfully for tests.");

    // 🔹 Log in as Admin
    const bcrypt = require("bcrypt");
    const admin = await User.findOne({ where: { username: "admin" } });
    const isMatch = await bcrypt.compare("P@ssword2023", admin.password);
    console.log("Password matches:", isMatch);
    const adminLogin = await request(app)
        .post("/auth/login")
        .send({ username: "admin", password: "P@ssword2023" });

    console.log("Admin Login Response:", adminLogin.body); // Debug
    expect(adminLogin.statusCode).toBe(200);
    expect(adminLogin.body.token).toBeDefined();
    userToken = adminLogin.body.token;
    expect(userToken).toBeDefined();

    console.log("✅ Admin authenticated");

    // 🔹 Get a test category, brand, and product
    const categoryRes = await request(app)
        .get("/admin/categories")
        .set("Authorization", `Bearer ${userToken}`);
    console.log("Categories Response:", categoryRes.body); // Debugging

    expect(categoryRes.body.categories).toBeDefined();
    expect(categoryRes.body.categories.length).toBeGreaterThan(0);
    testCategory = categoryRes.body.categories[0];

    const brandRes = await request(app)
        .get("/admin/brands")
        .set("Authorization", `Bearer ${userToken}`);
    console.log("Brands Response:", brandRes.body); // Debugging
    testBrand = brandRes.body.brands[0];

    const productRes = await request(app)
        .get("/admin/products")
        .set("Authorization", `Bearer ${userToken}`);
    console.log("Products Response:", productRes.body); // Debugging
    testProduct = productRes.body.products[0];

    expect(testCategory).toBeDefined();
    expect(testBrand).toBeDefined();
    expect(testProduct).toBeDefined();
});

describe("API Tests", () => {
  test("POST /admin/products - Add product", async () => {
    const res = await request(app)
      .post("/admin/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "TEST_PRODUCT",
        description: "Test product description",
        price: 99.99,
        stock: 10,
        categoryId: testCategory.id, 
        brandId: testBrand.id, 
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.product.name).toBe("TEST_PRODUCT");

    testProduct = res.body.product; // ✅ Store product for later tests
  });

  test("GET /admin/products - Retrieve product", async () => {
    const res = await request(app)
    .get(`/admin/products/${testProduct.id}`)
    .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product.name).toBe("TEST_PRODUCT");
  });

  test("PUT /admin/categories/:id - Update category", async () => {
    const res = await request(app)
      .put(`/admin/categories/${testCategory.id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "TEST_CATEGORY2" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.category.name).toBe("TEST_CATEGORY2");
  });

  test("PUT /admin/brands/:id - Update brand", async () => {
    const res = await request(app)
      .put(`/admin/brands/${testBrand.id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "TEST_BRAND2" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.brand.name).toBe("TEST_BRAND2");
  });

  test("DELETE /admin/products/:id - Soft delete product", async () => {
    const res = await request(app)
    .delete(`/admin/products/${testProduct.id}`)
    .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  afterAll(async () => {
    await sequelize.close();
    console.log("Database connection closed.");
    });
});