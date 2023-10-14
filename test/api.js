const assert = require("chai").assert;
const request = require("supertest");
const app = require("../app");

const token = "iO3quoYg265hlzq30E8RelQc0LOKle4R0yk6CMbgeHgGNcm_mR";
describe("Item API Testing", () => {
  it("GET API Landing Page", (done) => {
    const expectedHero = {
      travelers: 41,
      treasures: 1,
      cities: 1,
    };
    const expectedMostPicked = [
      {
        country: "Indonesia",
        unit: "day",
        imageId: [
          {
            _id: "651e1dffbf0fc942e41ba0c3",
            imageUrl: "images/1696472573997.jpg",
          },
          {
            _id: "651e1e00bf0fc942e41ba0c6",
            imageUrl: "images/1696472574023.jpg",
          },
          {
            _id: "651e1e00bf0fc942e41ba0c9",
            imageUrl: "images/1696472574034.jpg",
          },
        ],
        trackId: [
          {
            _id: "651e1e7bbf0fc942e41ba0f4",
            name: "Ranupane",
            province: "Jawa Timur",
            city: "Lumajang",
          },
        ],
        _id: "651e1dfebf0fc942e41ba0bd",
        title: "Gunung Semeru",
        price: 14000,
      },
    ];
    const expectedCategory = [
      {
        itemId: [
          {
            country: "Indonesia",
            isPopular: true,
            imageId: [
              {
                _id: "651e1dffbf0fc942e41ba0c3",
                imageUrl: "images/1696472573997.jpg",
              },
            ],
            trackId: [
              {
                _id: "651e1e7bbf0fc942e41ba0f4",
                name: "Ranupane",
                province: "Jawa Timur",
                city: "Lumajang",
              },
            ],
            _id: "651e1dfebf0fc942e41ba0bd",
            title: "Gunung Semeru",
          },
        ],
        _id: "651e1d93bf0fc942e41ba0aa",
        name: "Seven Summit",
      },
    ];
    const expectedTestimonial = {
      _id: "asd1293uasdads1",
      imageUrl: "images/testimonial2.jpg",
      name: "Happy Family",
      rate: 4.55,
      content:
        "What a great trip with my family and I should try again next time soon ...",
      familyName: "Angga",
      familyOccupation: "Product Designer",
    };
    request(app)
      .get("/api-v1/landing-page")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (res.status === 200) {
          assert.equal(res.body.message, "Success");
          assert.deepEqual(res.body.hero, expectedHero);
          assert.deepEqual(res.body.mostPicked, expectedMostPicked);
          assert.deepEqual(res.body.category, expectedCategory);
          assert.deepEqual(res.body.testimonial, expectedTestimonial);
        } else if (res.status === 404) {
          assert.equal(res.body.message, "Empty Item");
        } else {
          done(err);
        }
        done();
      });
  });
  it("GET API Detail Page", (done) => {
    request(app)
      .get("/api-v1/detail-page/651e1dfebf0fc942e41ba0bd")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
          return;
        }

        if (res.status === 200) {
          assert.equal(res.body.message, "Success");
        } else if (res.status === 404) {
          assert.equal(res.body.message, "Failed to convert temperature");
        } else if (res.status === 401) {
          assert.equal(
            res.body.message,
            "Failed to fetch current weather data"
          );
        } else if (res.status === 402) {
          assert.equal(res.body.message, "Item Saat Ini Tidak Tersedia");
        } else if (res.status === 500) {
          assert.equal(res.body.message, "Item Tidak Tersedia");
        } else {
          done(new Error(`Unexpected response status: ${res.status}`));
          return;
        }

        done();
      });
  });
});
