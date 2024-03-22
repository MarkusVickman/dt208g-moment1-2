/*TypeScript-kod för att hantera inlägg på webbplatsen där användaren kan spara in kurskod som även lagras till localstorage. 
Användaren kan även redigera tidigare inlägg*/

/*Deklarerar variabler för element. courseform och main används till evenlistener och alert1 + 2 används för att skriva ut meddelande på skärmen.
courselist är där sparade inlägg skrivs ut och courseform är därifrån inlägg skrivs in*/
const alert1: HTMLParagraphElement = document.getElementById("alert") as HTMLParagraphElement;
const alert2: HTMLParagraphElement = document.getElementById("alert2") as HTMLParagraphElement;
const courseDiv: HTMLDivElement = document.getElementById("courselist") as HTMLDivElement;
const main: HTMLElement = document.getElementById("main") as HTMLElement;
const courseForm: HTMLFormElement = document.getElementById("courseform") as HTMLFormElement;

//Interface som sätter typer för object. Används i 2 olika funktioner i koden.
interface CourseInfo {
    code: string;
    name: string;
    progression: string;
    syllabus: string;
}

//Vid start körs funktionen restoreData som läser in från localstorage. Funktionen körs också vid uppdatering av inlägg.
restoreData();
function restoreData(): void{
    courseDiv.innerHTML = "";
    if (localStorage.length >= 1) {
        for (let i = 0; i < localStorage.length; i++) {
            // set iteration key name
            const key: string = localStorage.key(i)!;
            // use key name to retrieve the corresponding value
            const value: string = localStorage.getItem(key)!;
            manageCourses((JSON.parse(value)));
        }
    }
}

/*Eventlistener för för knappar som skapas i denna kod. Det hade gått att lösa snyggare om den initierat olika
 funktioner istället för att köra så mycket kod direkt i lyssnaren(vilket den gör på ett par ställen).*/
main.addEventListener("click", function (e: MouseEvent) {
    alert1.innerHTML = "";
    alert2.innerHTML = "";

    //Om klick är på ta bort-knappen används titel för att identifiera vilken div som ska tas bort och vilken nyckel som ska bort i local storage.
    if (e.target !== null && (e.target as HTMLButtonElement).classList.contains("remove-btn")) {
        const removeCourse: HTMLElement = document.getElementById((e.target as HTMLButtonElement).title)!;
        const storageKey: string = (e.target as HTMLButtonElement).title;
        if (removeCourse !== null) {
            localStorage.removeItem(storageKey);
            removeCourse.remove();
        }
    }

    //Om target är på knappen töm allt så rensas localstorage och huvud-diven med innehåll
    else if (e.target !== null && (e.target as HTMLButtonElement).id === "empty-localstorage") {
        localStorage.clear();
        courseDiv.innerHTML = "";
    }

    /*Större if sats med if/ else if-satser i sig. Vid klick på uppdateringsknappen läser alla textsträngar in med hjälp av prefix + kurskod. Texten formateras lite enkelt också. 
    Dessa testas för att alla fält är ifyllda på rätt sätt och get alert utifrån det. Sidan och localstorage uppdateras också med hjälp av knappens titel.*/ 
    else if (e.target !== null && (e.target as HTMLButtonElement).classList.contains("update-btn")) {
        const codeInput: string = (document.getElementById("code" + (e.target as HTMLButtonElement).title) as HTMLInputElement).textContent!.toUpperCase();
        const nameInput: string = (document.getElementById("name" + (e.target as HTMLButtonElement).title) as HTMLInputElement).textContent!;
        const progressionInput: string = (document.getElementById("progression" + (e.target as HTMLButtonElement).title) as HTMLInputElement).textContent!.toUpperCase();
        const syllabusInput: string = (document.getElementById("syllabus" + (e.target as HTMLButtonElement).title) as HTMLInputElement).textContent!;
        //För att kunna tabort gamla inlägget när uppdatering sker till en ny key i localstorage
        const originalCode: string = (e.target as HTMLButtonElement).title;
        //Ger felmeddelande om inte input är a, b, c eller av.
        if (progressionInput !== "A" && progressionInput !== "B" && progressionInput !== "C" && progressionInput !== "AV") {
            alert(`Progression måste innehålla A, B, C eller AV`);
        }
        //Checkar så att alla fält är ifyllda
        else if (codeInput.length === 0 || progressionInput.length === 0 || nameInput.length === 0 || syllabusInput.length === 0 ){
            alert("Fyll i alla fält");
        }
        //Om inget av de övriga gav "positivt" så skapas en nytt objekt utifrån interfacen CoursInfo
        else {
            // Skapa ett användarobjekt
            const editCourse: CourseInfo = {
                code: codeInput,
                name: nameInput,
                progression: progressionInput,
                syllabus: syllabusInput,
            };
            //Tar bort gamla inlägget i localstorage, skriver ut en alert för att visa ändring och tar bort diven med gamla inlägget.
            localStorage.removeItem(originalCode);
            alert(`Redigering av kurs ${codeInput} är nu lagrad.`);
            document.getElementById((e.target as HTMLButtonElement).title)!.remove();

            // Loopar igenom localstorage för att se om det redan fanns en localstorage key(kurskod) med samma namn. Isåfall informeras användaren att den kursen är översparad.
            for (let i = 0; i < localStorage.length; i++) {
                const key: string = localStorage.key(i)!;
                if (codeInput === key) {
                    alert(`${codeInput} fanns redan och är översparad!`);
                }
            }
            //Lägger till ändringen i localstorage som ett stringifierat objekt med key = nya kurskoden och sedan laddas sidan om från local storage igen.
            localStorage.setItem(codeInput, JSON.stringify(editCourse));
            restoreData();
        }
    }
});

//Funktionen används för att bygga ut kurserna/inläggen på webbplatsen. Funktionen körs en gång för varje nytt inlägg eller för varje index i localstorage
function manageCourses(course: CourseInfo): void {
    //En ny div att lagra inlägget i. Den får klass, id och text skrivs ut i den med kursinformation.
    let newCourseDiv: HTMLDivElement = document.createElement("div");
    newCourseDiv.classList.add("newdiv");
    newCourseDiv.id = course.code;
    newCourseDiv.innerHTML = `
    <h2>${course.name.charAt(0).toUpperCase() + course.name.slice(1)}:</h2>
    <p><strong>Kurskod:</strong><span contenteditable="true" id="code${course.code}" class="edit">${course.code}</span></p>
    <p><strong>Kursnamn:</strong><span contenteditable="true" id="name${course.code}" class="edit">${course.name.charAt(0).toUpperCase() + course.name.slice(1)}</span></p>
    <p><strong>Progression:</strong><span contenteditable="true" id="progression${course.code}" class="edit">${course.progression}</span></p>
    <p><strong>Kursplan:</strong> <a href="${course.syllabus}" contenteditable="true" id="syllabus${course.code}" class="edit">${course.syllabus}<a></p>
  `;
    //Skapar ta bort och uppdatera knappar med kurskod som titel för att kunna identifiera vilken div det handlar om
    let removeButton: HTMLButtonElement = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.title = course.code;
    let removeText = document.createTextNode("Ta bort");
    removeButton.appendChild(removeText);
    let updateButton: HTMLButtonElement = document.createElement("button");
    updateButton.classList.add("update-btn");
    updateButton.title = course.code;
    let updateText = document.createTextNode("Uppdatera");
    updateButton.appendChild(updateText);
    //Lägger till nya diven om knappar till huvud-diven på hemsidan.
    newCourseDiv.appendChild(removeButton);
    newCourseDiv.appendChild(updateButton);
    courseDiv.appendChild(newCourseDiv);
}

// Lägg till händelselyssnare på formuläret
courseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Hämta kursdata från formuläret med lätt textformatering
    const codeInput: string = (document.getElementById("code") as HTMLInputElement).value.toUpperCase();
    const nameInput: string = (document.getElementById("name") as HTMLInputElement).value;
    const progressionInput: string = (document.getElementById("progression") as HTMLInputElement).value.toUpperCase();
    const syllabusInput: string = (document.getElementById("syllabus") as HTMLInputElement).value;
    // testar om kurkoden redan finns på sidan, ger då felmeddelande
    if (document.getElementById(codeInput) !== null) {
        alert1.innerHTML = `
    <p style="color:Red;"><strong>${codeInput} finns redan i listan!</strong></p>
    `;
    }
    // testar om progression är rätt ifyllt, ger annars felmeddelande
    else if (progressionInput !== "A" && progressionInput !== "B" && progressionInput !== "C" && progressionInput !== "AV") {
        alert2.innerHTML = `
    <p style="color:Red;"><strong>Progression får endast vara A, B, C eller AV!</strong></p>
    `;
    }
    //Annars skapas ett objekt med inputdata och en bekräftelse skrivs ut.
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
        //Localstorage sparar kursdatan
        localStorage.setItem(codeInput, JSON.stringify(newCourse));
        // Funktionen för att bygga inlägg på sidan initieras.
        manageCourses(newCourse);
    }
});