'use strict'

// function setUpPhotos() {
//   const elements = document.querySelectorAll(".people-list__line");
//   const elementsArray = [...elements];
//   elementsArray.forEach((element) => {
//     const child = element.querySelector(".people-list__photo");
//     const toggleElement = (state) => {
//       element.classList.toggle("active", state);
//       child.classList.toggle("active", state);
//     };

//     element.addEventListener("mouseenter", () => {
//       toggleElement(true);
//     });

//     element.addEventListener("mouseleave", () => {
//       toggleElement(false);
//     });
//   });
// }

function setUpSearch() {
  const searchbar = document.querySelector('.searchbar')
  if (!searchbar) {
    return
  }
  const input = searchbar.querySelector('input')
  const updateElement = (state) => {
    const searchResult = input.value || state
    searchbar.classList.toggle('active', searchResult)
  }
  input.addEventListener('focus', updateElement.bind(null, true))
  input.addEventListener('blur', updateElement.bind(null, false))
}

function setUpPanel() {
  const overlay = document.querySelector('.overlay')
  const overlayPanel = document.querySelector('.overlay-panel')
  if (!overlay || !overlayPanel) {
    return
  }

  const elements = document.querySelectorAll('.people-list__action')
  const elementsArray = [...elements]
  elementsArray.forEach((element) => {
    element.addEventListener('click', () => {
      overlay.classList.toggle('active', true)
      overlayPanel.classList.toggle('active', true)
    })
  })

  const gutterLabel = document.querySelector('.panel-gutter__label')
  gutterLabel.addEventListener('click', () => {
    overlay.classList.toggle('active', false)
    overlayPanel.classList.toggle('active', false)
  })
}

function setUpCalendar() {
  const calendarEl = document.querySelector('.calendarEl')
  if (!calendarEl) {
    return
  }
  const calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: 'UTC',
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    events: 'https://fullcalendar.io/api/demo-feeds/events.json',
  })
  calendar.render()
}

function setUpBackScroll() {
  const scrollBackPanel = document.querySelector('.scroll-back')
  if (!scrollBackPanel) {
    return
  }
  let previousScroll = 0
  window.addEventListener('scroll', function () {
    scrollBackPanel.classList.toggle('hidden', window.scrollY > previousScroll)
    previousScroll = window.scrollY
  })
}

window.addEventListener('load', function () {
  // const elements = document.getElementsByClassName("card");
  // const elementsArray = [...elements];
  // elementsArray.forEach((element) => {
  //   element.addEventListener("mouseenter", () => {
  //     const child = element.querySelector(".card__bottom");
  //     child.classList.toggle("active", true);
  //   });

  //   element.addEventListener("mouseleave", () => {
  //     const child = element.querySelector(".card__bottom");
  //     child.classList.toggle("active", false);
  //   });
  // });

  // setUpPhotos();
  setUpSearch()
  setUpPanel()
  setUpCalendar()
  setUpBackScroll()
})
