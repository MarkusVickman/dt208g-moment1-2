let alert1 = document.getElementById("alert") as HTMLParagraphElement;
let alert2 = document.getElementById("alert2") as HTMLParagraphElement;
const courseDiv = document.getElementById("courselist") as HTMLDivElement;

interface CourseInfo {
    code: string;
    name: string;
    progression: string;
    syllabus: string;
}

restoreData();

function restoreData(){

    courseDiv.innerHTML = "";
    if (localStorage.length >= 1) {
        for (let i = 0; i < localStorage.length; i++) {
    
            // set iteration key name
            const key = localStorage.key(i);
    
            // use key name to retrieve the corresponding value
            const value = localStorage.getItem(key);
            manageCourses((JSON.parse(value)));

            console.log(key + " " + value);
        }
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
    alert1.innerHTML = "";
    alert2.innerHTML = "";

    if (e.target !== null && (e.target as HTMLButtonElement).classList.contains("remove-btn")) {
        let removeCourse = document.getElementById((e.target as HTMLButtonElement).title);
        let storageKey = (e.target as HTMLButtonElement).title;
        console.log(removeCourse);
        if (removeCourse !== null) {
            localStorage.removeItem(storageKey);
            removeCourse.remove();
        }
    }
    else if (e.target !== null && (e.target as HTMLButtonElement).id === "empty-localstorage") {
        localStorage.clear();
        courseDiv.innerHTML = "";
    }

    else if (e.target !== null && (e.target as HTMLButtonElement).classList.contains("update-btn")) {
        const codeInput = (document.getElementById("code" + (e.target as HTMLButtonElement).title) as HTMLInputElement).textContent.toUpperCase();
        const nameInput = (document.getElementById("name" + (e.target as HTMLButtonElement).title) as HTMLInputElement).textContent;
        const progressionInput = (document.getElementById("progression" + (e.target as HTMLButtonElement).title) as HTMLInputElement).textContent.toUpperCase();
        const syllabusInput = (document.getElementById("syllabus" + (e.target as HTMLButtonElement).title) as HTMLInputElement).textContent;
        const originalCode: string = (e.target as HTMLButtonElement).title;
        let testKey: string = codeInput;//document.getElementById("code" + (e.target as HTMLButtonElement).title).textContent;

        if (progressionInput !== "A" && progressionInput !== "B" && progressionInput !== "C" && progressionInput !== "AV") {
            alert(`Progression måste innehålla A, B, C eller AV`);
        }

        else {
            // Skapa ett användarobjekt
            const editCourse: CourseInfo = {
                code: codeInput,
                name: nameInput,
                progression: progressionInput,
                syllabus: syllabusInput,
            };

            localStorage.removeItem(originalCode);

            alert(`Redigering av kurs ${codeInput} är nu lagrad.`);
            document.getElementById((e.target as HTMLButtonElement).title).remove();
            console.log(document.getElementById((e.target as HTMLButtonElement).title));


            // Notering: här borde inputvalidering läggas till
            for (let i = 0; i < localStorage.length; i++) {

                // set iteration key name
                const key = localStorage.key(i);
                console.log(testKey + " " + key + " " + originalCode);
                if (testKey === key /*&& testKey !== originalCode*/) {
                    //localStorage.removeItem(testKey);
                    alert(`${codeInput} fanns redan och är översparad!`);
                }
            }
            localStorage.setItem(codeInput, JSON.stringify(editCourse));
            restoreData();
        }
    }
});



function manageCourses(course: CourseInfo): void {

    let newCourseDiv: HTMLDivElement = document.createElement("div");
    newCourseDiv.classList.add("newdiv");

    newCourseDiv.id = course.code;
    newCourseDiv.innerHTML = `
    <h2>${course.name.toUpperCase()}:</h2>
    <p><strong>Kurskod:</strong><span contenteditable="true" id="code${course.code}" class="edit">${course.code}</span></p>
    <p><strong>Kursnamn:</strong><span contenteditable="true" id="name${course.code}" class="edit">${course.name.charAt(0).toUpperCase() + course.name.slice(1)}</span></p>
    <p><strong>Progression:</strong><span contenteditable="true" id="progression${course.code}" class="edit">${course.progression}</span></p>
    <p><strong>Kursplan:</strong> <a href="${course.syllabus}" contenteditable="true" id="syllabus${course.code}" class="edit">${course.syllabus}<a></p>
  `;
    let removeButton: HTMLButtonElement = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.title = course.code;
    let removeText: HTMLTextAreaElement = document.createTextNode("Ta bort");
    removeButton.appendChild(removeText);

    let updateButton: HTMLButtonElement = document.createElement("button");
    updateButton.classList.add("update-btn");
    updateButton.title = course.code;
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
    const codeInput = (document.getElementById("code") as HTMLInputElement).value.toUpperCase();
    const nameInput = (document.getElementById("name") as HTMLInputElement).value;
    const progressionInput = (document.getElementById("progression") as HTMLInputElement).value.toUpperCase();
    const syllabusInput = (document.getElementById("syllabus") as HTMLInputElement).value;


    // Notering: här borde inputvalidering läggas till
    if (document.getElementById(codeInput) !== null) {
        alert1.innerHTML = `
    <p style="color:Red;"><strong>${codeInput} finns redan i listan!</strong></p>
    `;
    }

    else if (progressionInput !== "A" && progressionInput !== "B" && progressionInput !== "C" && progressionInput !== "AV") {
        alert2.innerHTML = `
    <p style="color:Red;"><strong>Progression får endast vara A, B, C eller AV!</strong></p>
    `;
    }
    else {
        alert1.innerHTML = `<p style="color:Green;"><strong>${codeInput} är sparad i listan</strong></p>`;
        alert2.innerHTML = "";
        // Skapa ett användarobjekt
        const newCourse: CourseInfo = {
            code: codeInput,
            name: nameInput,
            progression: progressionInput,
            syllabus: syllabusInput,
        };

        localStorage.setItem(codeInput, JSON.stringify(newCourse));
        // Använd printUserDetails för att skriva ut användardetaljer
        manageCourses(newCourse);

    }
});
