   const getTimeStamp = () => {
      var dateString = Date();
      var dateArray = dateString.split(" ");
      var newDate = "";
      for (var i = 1;i < 5;i++) {
          newDate += dateArray[i] + " ";
      }
      return newDate;
  }


module.exports = getTimeStamp;