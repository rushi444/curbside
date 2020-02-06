//import GoogleMaps

class City {
  /* The constructor takes in a list of data points representing the city, 
	where each data point takes the form (12-digit-geohash, curb_designation). 
	Store this data inside the class and perform any other work you need to do 
	for the other two methods in this class. Your goal here is to store the data 
	in a format that makes your search function accurate and time efficient.
    */
  constructor(data) {
    this.data = data.sort((a, b) => a[0] - b[0]); // if data points are numeric, else would need to create a custom sort
  }
  /* @params: address-the user's entered dropoff address’s 12-digit-geohash
	This method should search around “address” for the best curb spaces available. 
	@returns: array of top 10 curb spaces close to passed address (as mentioned above, 
	you’ll need to design a metric which takes into account (a) distance from address 
	and (b) curb_designation value.
    */
  search(address) {
    let addressIndex = this.binarySearch(this.data, address);
    let tenCurbSpaces = this.data.slice(addressIndex - 5, addressIndex + 5);

    tenCurbSpaces.sort((a, b) => {
      let aScore = GoogleMaps.getDistance(address, a[0]) - a[1]; //Since less distance and higher ease access score is better, we are subtracting the ease score, meaning the lower the score the better
      let bScore = GoogleMaps.getDistance(address, b[0]) - b[1];
      aScore - bScore;
    });

    return tenCurbSpaces; //tenCurbSpaces[0] would be the best option
  }

  /* params: location -- a well-formed input (12-digit-geohash, curb_designation). 
	Update should take this information and update the data structure you initialized 
	in the City constructor. This function will either update the curb_designation 
	for an existing data point, or will insert a new data point. As an example, 
	imagine a user reports that a parking spot now has a hydrant. 
	returns: void
	*/
  update(location) {
    let geohashIndex = this.binarySearch(this.data, location[0]);
    geohashIndex === 'not a valid location'
      ? this.data.push(location)
      : (this.data[geohashIndex][1] = location[1]);
    data.sort((a, b) => a[0] - b[0]);
  }

  /**
   * @param {array} dataSet - list of data points
   * @param {string} target - geohash of user location
   * @returns {int || string} - index of target
   */
  binarySearch = (dataSet, target) => {
    let left = 0;
    let right = dataSet.length - 1;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);

      if (dataSet[mid][0] === target) {
        return mid;
      } else if (dataSet[mid][0] < target) {
        // not exactly sure how I would determine if one alphanumeric geohash is greater or less than another, but this is where I would use a helper function to determine
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return 'not a valid location';
  };
}

// geohash-A box that has more boxes in it, adds a number/letter to specify a location(only 32 options, up to 12 characters in length)

// Brainstorm steps
// sort data, is the geohash supposed to be only numeric? If not, might need to built out a custom sort
// assuming this data gets sorted correctly, implement a binary search to find the index of the user's location, then get an array of the ten closest
// figure out an optimal system to score the pickup spots, using meters and 1-10(10 being the best) rating for ease of pickup

// Edge Cases and Final Thoughs
// - After doing some research, Redis has very useful data-type: geospatial, would make finding the closest pickup location faster and easier
// - This solution currently would only work with an only numeric geohash, I would need to find a way to sort alphanumeric geohashes correctly.
// - This solution would only work if address is in the given data, it is possible to create a helper function which finds the closest geohash to user location in the dataset
// - Currently scale for calculating score of pickup spots is 1:1(1 meter per ease score point), would need to do some additional testing to see what works best
// - Finding 10 closest by getting closest in sorted array, might not always be closest(have to take into account these 10 might not be in all the surrounding directions, incline might make distance longer)
// - I did find a js library called geo-nearby, if I could build something similar with just pickup spots instead of all geohashes, it could be an extremely fast way to find closest pickup spots
// - Overall, I learned alot about geohashes in a few hours and now have a general idea. Only item I'm stuck with is how to sort geohashes correctly, would need to do more research to find a solution.
