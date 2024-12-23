const screens = require('../model/screen')

const getScreen = async (req, res) => {
  console.log("get screen")
  const city = req.header("city");  // ID Token sent from frontend

  try {
    
    const screenData = await screens.find({city:city})

    res.send({"status":true,data:screenData})
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


module.exports = { getScreen };