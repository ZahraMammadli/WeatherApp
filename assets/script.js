// Storing city searched into the local storage

$("#search-button").on("click", function (event) {
  event.preventDefault();
  var city = $(event.target).siblings().val();
  console.log(city);
  localStorage.setItem("city", city);
  //   var tasks = $(event.target).parent().siblings().last();
  //   var hour = $(event.target).parent().siblings().first();
  //   localStorage.setItem(hour.text().trim(), tasks.val());
});
