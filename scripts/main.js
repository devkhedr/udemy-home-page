let courses = [
  "Python",
  "AWS",
  "Data Science",
  "Excel",
  "Web Development",
  "JavaScript",
  "Drawing",
];

let cur_course = "Python";
let section = document.querySelector(".courses");
let data;
function fetchdata() {
  const response = fetch("https://api.jsonbin.io/v3/b/63007c245c146d63ca771db2")
    .then((response) => response.json())
    .then((res) => {
      data = res;
      //build the courses of the defult topic "python"
      build_description(cur_course);
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

function build_description(course) {
  section.innerHTML = "";
  const description = `
    <div class = "course-intro">
      <h1>${data.record[course].header}</h1>
      <p>${data.record[course].description}</p>
      <button class="explore-button"> Explore ${course} </button> 
    </div>
    `;
  section.innerHTML += description;
  make_cards_list(course);
}

function searchState (found, search) {
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
  if(found) {
    return description1; 
  }
  else {
    return description2;
  }
}

function make_cards_list(course = "", search = undefined) {
  let cards_container = document.createElement("div");
  cards_container.className = "courses-list";
  cards_container.id = "courses-list";
  let found = 0;
  for (const item of courses) {
    if (search != undefined) course = item;
    if (item != course) continue;

    for (const item in data.record[course].courses) {
      if (search != undefined) {
        let title = data.record[course].courses[item].title;
        title = title.toLowerCase();
        search = search.toLowerCase();
        if (!title.includes(search)) continue;
      }
      found = 1;
      let ready_card = make_card(course, item);
      cards_container.appendChild(ready_card);
    }
  }
  const ret = searchState(found, search);
  if(search != undefined && search != "") {
    section.innerHTML += ret;
  }
  section.appendChild(cards_container);
}

function make_card(course, item) {
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

fetchdata();

// move between tabs
for (const item in courses) {
  const course = document.getElementById(courses[item]);
  course.addEventListener("change", function () {
    cur_course = course.id;
    build_description(cur_course);
  });
}

// search bar usable (search in client side)
// building searching description
function build_search(searchvalue) {
  section.innerHTML = "";
  make_cards_list("", searchvalue);
}

// search on submit in search bar
const click_search = document.querySelector("[class = 'search-icon']")
click_search.addEventListener("click", (e) => {
  e.preventDefault();
  let searchvalue = document.querySelector("[class = 'search-text']").value;
  document.getElementById("courses").scrollIntoView({behavior: "smooth", block: "start"});
  build_search(searchvalue);
});
