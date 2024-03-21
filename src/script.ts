interface CourseInfo {
    code: string;
    name: string;
    progression: string;
    syllabus: string;
}


/*if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {

        // set iteration key name
        const key = localStorage.key(i);

        // use key name to retrieve the corresponding value
        const value = localStorage.getItem(key);
        manageCourses((JSON.parse(value)));
    }
}*/

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
        let storageKey = (e.target as HTMLButtonElement).title;

        if (removeCourse !== null) {
            localStorage.removeItem(storageKey);
            console.log(storageKey);
            removeCourse.remove();
        }
    }
    else if (e.target !== null && (e.target as HTMLButtonElement).id === "empty-localstorage") {
        localStorage.clear();
        const courseDiv = document.getElementById("courselist") as HTMLDivElement;
        courseDiv.innerHTML = "";
    }

    else if (e.target !== null && (e.target as HTMLButtonElement).classList.contains("update-btn")) {
        const codeInput = document.getElementById("code" + (e.target as HTMLButtonElement).title) as HTMLInputElement;
        const nameInput = document.getElementById("name" + (e.target as HTMLButtonElement).title) as HTMLInputElement;
        const progressionInput = document.getElementById("progression" + (e.target as HTMLButtonElement).title) as HTMLInputElement;
        const syllabusInput = document.getElementById("syllabus" + (e.target as HTMLButtonElement).title) as HTMLInputElement;
        // Skapa ett användarobjekt
        const editCourse: CourseInfo = {
            code: codeInput.value,
            name: nameInput.value,
            progression: progressionInput.value,
            syllabus: syllabusInput.value,
        };

        localStorage.setItem(codeInput.value, JSON.stringify(editCourse));
        // Använd printUserDetails för att skriva ut användardetaljer
        manageCourses(editCourse);
    }
});



function manageCourses(course: CourseInfo): void {
    console.log(course.code);
    const courseDiv = document.getElementById("courselist") as HTMLDivElement;
    let newCourseDiv: HTMLDivElement = document.createElement("div");
    newCourseDiv.classList.add("newdiv");

    newCourseDiv.id = course.code;
    newCourseDiv.innerHTML = `
    <h2>${course.name}:</h2>
    <p><strong>Kurskod:</strong><span contenteditable="true" id="code${course.code}" class="edit"> ${course.code.toUpperCase()} </span></p>
    <p><strong>Kursnamn:</strong><span contenteditable="true" id="name${course.code}" class="edit"> ${course.name.charAt(0).toUpperCase() + course.name.slice(1)}</span></p>
    <p><strong>Progression:</strong><span contenteditable="true" id="progression${course.code}" class="edit"> ${course.progression.toUpperCase()}</span></p>
    <p><strong>Kursplan:</strong> <a href="${course.syllabus}" contenteditable="true" id="syllabus${course.code}" class="edit">${course.syllabus}<a></p>
  `;
    let removeButton: HTMLButtonElement = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.title = course.code.toLowerCase();
    let removeText: HTMLTextAreaElement = document.createTextNode("Ta bort");
    removeButton.appendChild(removeText);

    let updateButton: HTMLButtonElement = document.createElement("button");
    updateButton.classList.add("update-btn");
    updateButton.title = course.code.toLowerCase();
    let updateText: HTMLTextAreaElement = document.createTextNode("Uppdatera");
    updateButton.appendChild(updateText);

    newCourseDiv.appendChild(removeButton);
    newCourseDiv.appendChild(updateButton);
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
            code: codeInput.value,
            name: nameInput.value,
            progression: progressionInput.value,
            syllabus: syllabusInput.value,
        };

        localStorage.setItem(codeInput.value, JSON.stringify(newCourse));
        // Använd printUserDetails för att skriva ut användardetaljer
        manageCourses(newCourse);

    }
});
