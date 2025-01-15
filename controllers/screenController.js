const screens = require('../model/screen')

// const getScreen = async (req, res) => {
//   console.log("get screen")
//   const city = req.header("city");  // ID Token sent from frontend

//   try {
    
//     const screenData = await screens.find({city:city})

//     res.send({"status":true,data:screenData})
    
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// };

const getScreen = async (req, res) => {
  console.log("get screen");

  const { latitude, longitude } = req.query;  // Use query params to get latitude and longitude
  
  // Ensure the latitude and longitude are valid
  if (!latitude || !longitude) {
    return res.status(400).send('Invalid coordinates');
  }

  try {
    const screenData = await screens.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          distanceField: "distance",
          maxDistance: 15000, // 15 km in meters
          spherical: true // Use spherical geometry for calculations
        }
      },
      {
        $project: {
          screenNumber: 1,
          location: 1,
          coordinate: 1,
          distance: 1,
          type: 1
        }
      }
    ]);

    res.send({ status: true, data: screenData });
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};





module.exports = { getScreen };