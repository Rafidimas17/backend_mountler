const assert = require("chai").assert;
const request = require("supertest");
const app = require("../app");

const token = "iO3quoYg265hlzq30E8RelQc0LOKle4R0yk6CMbgeHgGNcm_mR";
describe("Item API Testing", () => {
  it("GET API Landing Page", (done) => {
    const expectedHero = {
        travelers: 16,
        treasures: 1,
        cities: 1
      };
      const expectedMostPicked = [
        {
          country: 'Indonesia',
          unit: 'day',
          imageId: [
            {
              _id: '649c182efd615542d063d8ae',
              imageUrl: 'images/1687951404101.jpg'
            },
            {
              _id: '649c182efd615542d063d8af',
              imageUrl: 'images/1687951404136.jpg'
            },
            {
              _id: '649c182ffd615542d063d8b0',
              imageUrl: 'images/1687951404156.jpg'
            },
            {
              _id: '649c1830fd615542d063d8b1',
              imageUrl: 'images/1687951404171.jpg'
            },
            {
              _id: '649c1830fd615542d063d8b2',
              imageUrl: 'images/1687951404193.jpg'
            },
            {
              _id: '649c1831fd615542d063d8b3',
              imageUrl: 'images/1687951404219.jpg'
            }
          ],
          trackId: [
            {
              _id: '649c1865fd615542d063d8b5',
              name: 'Ranupane',
              province: 'Jawa Timur',
              city: 'Lumajang'
            }
          ],
          _id: '649c182cfd615542d063d8ad',
          title: 'Gunung Semeru',
          price: 13000
        }
      ];
      const expectedCategory=[
        {
            itemId: [
                {
                    country: "Indonesia",
                    isPopular: true,
                    imageId: [
                        {
                            _id: "649c182efd615542d063d8ae",
                            imageUrl: "images/1687951404101.jpg"
                        }
                    ],
                    trackId: [
                        {
                            _id: "649c1865fd615542d063d8b5",
                            name: "Ranupane",
                            province: "Jawa Timur",
                            city: "Lumajang"
                        }
                    ],
                    _id: "649c182cfd615542d063d8ad",
                    title: "Gunung Semeru"
                }
            ],
            _id: "649c17b3fd615542d063d8ab",
            name: "Seven Summit Indonesia"
        }
    ];
    const expectedTestimonial={
        _id: "asd1293uasdads1",
        imageUrl: "images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content: "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer"
    }
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
  it('GET API Detail Page',(done)=>{
    request(app)
    .get("/api-v1/detail-page/649c182cfd615542d063d8ad")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .end((err,res)=>{
      if(res.status===200){
        assert.equal(res.body.message,'Success')
      }
      else if(res.status===404){
        assert.equal(res.body.message,'Failed to convert temperature')
      }
      else if(res.status===401){
        assert.equal(res.body.message,'Failed to fetch current weather data')
      }
      else if(res.status===402){
        assert.equal(res.body.message,'Item saat ini Tidak Tersedia')
      }
      else if(res.status===500){
        assert.equal(res.body.message,'Item Tidak Tersedia')
      }
      else{
        done(err)
      }

    })
    done()
  })
});
