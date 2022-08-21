let courses = [
  "Python",
  "AWS",
  "Data Science",
  "Excel",
  "Web Development",
  "JavaScript",
  "Drawing",
];

let curCourse = "Python";
let courseSection = document.querySelector(".courses");
let data;

function fetchData() {
  const response = fetch("https://api.jsonbin.io/v3/b/63007c245c146d63ca771db2")
    .then((response) => response.json())
    .then((res) => {
      data = res;
      //build the courses of the defult topic "python"
      buildCoursecourseSection(curCourse);
    });
}

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

function buildCoursecourseSection(course) {
  courseSection.innerHTML = "";
  const description = `
    <div class = "course-intro">
      <h1>${data.record[course].header}</h1>
      <p>${data.record[course].description}</p>
      <button class="explore-button"> Explore ${course} </button> 
    </div>
    `;
  courseSection.innerHTML += description;
  makeCourseCards(course);
}

function searchState(found, search) {
  const description1 = `
  <b style = "font-size:25px;margin-left:20px;"> 
  Search results for "${search}" : <b><br><br>
  `;
  const description2 = `
    <b style = "font-size:25px;margin-left:20px;"> Sorry, 
    we couldn't find any results for "${search}" </b>
    <br><br>
    <b style = "font-size:18px;margin-left:20px;">
    Try adjusting your search. Here are some ideas:</b>
    <br><br>
    <ul>
      &nbsp<li>Make sure all words are spelled correctly</li>
      <li>Try different search terms</li>
      <li>Try more general search terms</li>
    </ul>
  `;
  if (found) {
    return description1;
  } else {
    return description2;
  }
}

let n = 0;

function checkOnWindowwSize() {
  if (window.matchMedia("(width <= 520px)").matches) {
    n = 1;
  } else if (window.matchMedia("(width <= 768px)").matches) {
    n = 2;
  } else if (window.matchMedia("(width <= 1015px)").matches) {
    n = 3;
  } else if (window.matchMedia("(width >= 1350px)").matches) {
    n = 5;
  } else {
    n = 4;
  }

}



function makeCourseCards(course = "", search = undefined) {
  let cardsContainer = document.createElement("div");
  cardsContainer.className = "carousel slide";
  cardsContainer.id = "carouselExampleIndicators";
  cardsContainer.setAttribute("data-ride", "carousel");
  cardsContainer.setAttribute("position", "relative");
  let allSlides = document.createElement("div");
  allSlides.className = "carousel-inner";
  let slideContainer = document.createElement("div");
  slideContainer.className = "carousel-item active";
  let slide = document.createElement("div");
  slide.className = "courses-list";
  let cnt = 0,
    found = 0;
  for (const item of courses) {
    if (search != undefined) course = item;
    if (item == course) {
      for (const item in data.record[course].courses) {
        if (search != undefined) {
          let title = data.record[course].courses[item].title;
          title = title.toLowerCase();
          search = search.toLowerCase();
          if (!title.includes(search)) continue;
        }

        if (cnt == n) {
          slideContainer.appendChild(slide);
          allSlides.appendChild(slideContainer);
          slideContainer = document.createElement("div");
          slideContainer.className = "carousel-item";
          slide = document.createElement("div");
          slide.className = "courses-list";
          cnt = 0;
        }
        found = 1;
        cnt++;
        let cardlink = makeCard(course, item);
        slide.appendChild(cardlink);
      }
    }
  }
  if (cnt != 0) {
    slideContainer.appendChild(slide);
    allSlides.appendChild(slideContainer);
  }
  cardsContainer.appendChild(allSlides);

  const leftButton = `
  <button class="carousel-control-prevv" href="#carouselExampleIndicators" type="button" data-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </button>
`;
  const rightButton = `
  <button class="carousel-control-nextt" href="#carouselExampleIndicators" type="button" data-slide="next">
    <span class=" carousel-control-next-icon"></span> 
  </button>
 `;
  cardsContainer.innerHTML += leftButton;
  cardsContainer.innerHTML += rightButton;

  const ret = searchState(found, search);
  if (search != undefined && search != "") {
    courseSection.innerHTML += (ret);
  }
  if (found) {
    courseSection.appendChild(cardsContainer);
  }

}

function makeCard(course, item) {
  const newCourse = document.createElement("div");
  newCourse.classList.add("recommend");
  let instructor = "";
  for (const instr in data.record[course].courses[item].instructors) {
    instructor +=
      data.record[course].courses[item].instructors[instr].name + ", ";
  }
  instructor = instructor.slice(0, -2);
  newCourse.innerHTML = `
  <img src=${data.record[course].courses[item].image} alt=${
    data.record[course].courses[item].title
  }/>
  <h5>${data.record[course].courses[item].title}</h5>
  <div class="authorName">${instructor}</div>
  <div class="rate">
      ${data.record[course].courses[item].rating.toFixed(1)}
      ${getStars(data.record[course].courses[item].rating.toFixed(1))}
  </div>
  <span class = "price">E&pound;${
    data.record[course].courses[item].price
  }</span>
  `;
  return newCourse;
}
fetchData();

// moving between tabs
for (const item in courses) {
  const course = document.getElementById(courses[item]);
  course.addEventListener("change", function () {
    curCourse = course.id;
    buildCoursecourseSection(curCourse);
  });
}

// search bar usable (search in client side)
function buildSearch(searchvalue) {
  courseSection.innerHTML = "";
  makeCourseCards("", searchvalue);
}

const click_search = document.querySelector("[class = 'search-icon']");
click_search.addEventListener("click", (e) => {
  e.preventDefault();
  let searchvalue = document.querySelector("[class = 'search-text']").value;
  document
    .getElementById("courses")
    .scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  buildSearch(searchvalue);
});

checkOnWindowwSize();

window.addEventListener('resize', function () {
  checkOnWindowwSize();
  let searchvalue = document.querySelector("[class = 'search-text']").value;
  courseSection.innerHTML = "";
  if(searchvalue != "") {
    buildSearch(searchvalue);
  }
  else {
    makeCourseCards(curCourse);
  }
})
