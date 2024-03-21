interface CourseInfo {
    code: string;
    name: string;
    progression: string;
    syllabus: string;
}

if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {

        // set iteration key name
        const key = localStorage.key(i);

        // use key name to retrieve the corresponding value
        const value = localStorage.getItem(key);
        manageCourses((JSON.parse(value)));
    }
}

const main = document.getElementById("main") as HTMLBodyElement;

/*main.addEventListener("click", function (e: MouseEvent) {
    if (e.target !== null && (e.target as HTMLDivElement).classList.contains("newdiv")) {
        let removeCourse = document.getElementById((e.target as HTMLDivElement).id);
    
        if (removeCourse !== null) {
            localStorage.removeItem((e.target as HTMLDivElement).id); 
            removeCourse.remove();
        }
    }
});*/


main.addEventListener("click", function (e: MouseEvent) {
    if (e.target !== null && (e.target as HTMLButtonElement).classList.contains("remove-btn")) {
        let removeCourse = document.getElementById((e.target as HTMLButtonElement).title);

        if (removeCourse !== null) {
            localStorage.removeItem((e.target as HTMLButtonElement).title);
            console.log(localStorage.removeItem((e.target as HTMLButtonElement).title));
            removeCourse.remove();
        }
    }
    else if(e.target !== null && (e.target as HTMLButtonElement).id === "empty-localstorage"){
        localStorage.clear();
    }
});



function manageCourses(course: CourseInfo): void {
    const courseDiv = document.getElementById("courselist") as HTMLDivElement;
    let newCourseDiv: HTMLDivElement = document.createElement("div");
    newCourseDiv.classList.add("newdiv");

    newCourseDiv.id = course.code;
    newCourseDiv.innerHTML = `
    <h2>${course.name}:</h2>
    <p><strong>Kurskod:</strong> ${course.code}</p>
    <p><strong>Kursnamn:</strong> ${course.name}</p>
    <p><strong>Progression:</strong> ${course.progression}</p>
    <p><strong>Kursplan:</strong> <a href="${course.syllabus}">${course.syllabus}<a></p>
  `;
    let newButton: HTMLButtonElement = document.createElement("button");
    newButton.classList.add("remove-btn");
    newButton.title = course.code;

    newCourseDiv.appendChild(newButton);
    courseDiv.appendChild(newCourseDiv);
}

// Hämta DOM-element för formulär och användardetaljer
const courseForm = document.getElementById("courseform") as HTMLFormElement;

// Lägg till händelselyssnare på formuläret
courseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Hämta värden från formuläret
    const codeInput = document.getElementById("code") as HTMLInputElement;
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const progressionInput = document.getElementById("progression") as HTMLInputElement;
    const syllabusInput = document.getElementById("syllabus") as HTMLInputElement;

    // Notering: här borde inputvalidering läggas till
    if (document.getElementById(codeInput.value) !== null) {
        let alert = document.getElementById("alert") as HTMLParagraphElement;
        alert.innerHTML = `
    <p style="color:Red;"><strong>${codeInput.value} finns redan i listan!</strong></p>
    `;
    }

    else if (progressionInput.value.toUpperCase() !== "A" && progressionInput.value.toUpperCase() !== "B" && progressionInput.value.toUpperCase() !== "C") {
        let alert2 = document.getElementById("alert2") as HTMLParagraphElement;
        alert2.innerHTML = `
    <p style="color:Red;"><strong>Progression får endast vara A, B eller C!</strong></p>
    `;
    }
    else {
        // Skapa ett användarobjekt
        const newCourse: CourseInfo = {
            code: codeInput.value.toUpperCase(),
            name: nameInput.value.charAt(0).toUpperCase() + nameInput.value.slice(1),
            progression: progressionInput.value.toUpperCase(),
            syllabus: syllabusInput.value,
        };

        localStorage.setItem(codeInput.value, JSON.stringify(newCourse));
        // Använd printUserDetails för att skriva ut användardetaljer
        manageCourses(newCourse);
    }
});
