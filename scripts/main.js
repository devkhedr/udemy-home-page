let pythonCourses = document.querySelector(".python-list");

let getStars = function (courseRate) {
  let Res = [];
  for (let i = 1; i <= 5; i++, courseRate--) {
    if (courseRate >= 1) {
      Res.push('<i class="fa fa-star"></i>');
    } else if (courseRate <= 0) {
      Res.push('<i class="fa-regular fa-star"></i>');
    } else {
      Res.push('<i class="fa-regular fa-star-half-stroke"></i>');
    }
  }
  return Res.join("\n");
};

let addCourseToList = function (course) {
  const newCourse = document.createElement("div");
  newCourse.classList.add("recommend");
  newCourse.innerHTML = `
  <img src=${course.image} alt=${course.title}/>
  <h5>${course.title}</h5>
  <div class="authorName">${course.author}</div>
  <div class="rate">
      ${course.rate}
      ${getStars(course.rate)}
  <span class = "number"> (${course.people})</span>
  </div>
  <span class = "price">E&pound;${course.price}</span>
  `;
  pythonCourses.appendChild(newCourse);
};



let coursesList;

async function fetchData() {
  const response = await fetch("https://api.npoint.io/719889b51085a7230399");
  coursesList = await response.json();
  for (let i = 0; i < coursesList.length; i++) {
    addCourseToList(coursesList[i]);
  }
}
fetchData();

// search bar usable (search in client side)

document.querySelector(".search-icon").addEventListener("click", (event) => {
  event.preventDefault();
});

document.querySelector(".search-text").addEventListener("input", (event) => {
  let List = document.querySelector(".python-list");
  List.innerHTML = "";
  for (let i = 0; i < coursesList.length; i++) {
    let curTitle = coursesList[i].title.toLowerCase();
    let hint = event.target.value.toLowerCase();
    if (curTitle.includes(hint) === false) continue;
    addCourseToList(coursesList[i]);
  }
});