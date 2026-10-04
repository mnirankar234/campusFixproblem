// Store all complaints
let complaints = [];


// Show Student section
function showStudent() {

    document.getElementById("student").style.display = "block";

    document.getElementById("admin").style.display = "none";
}


// Show Admin section
function showAdmin() {

    document.getElementById("student").style.display = "none";

    document.getElementById("admin").style.display = "block";

    showAdminComplaints();
}


// Submit complaint

// Submit complaint
async function submitIssue(event) {

    event.preventDefault();

    let title = document.getElementById("title").value;
    let category = document.getElementById("category").value;
    let location = document.getElementById("location").value;
    let priority = document.getElementById("priority").value;
    let description = document.getElementById("description").value;

    let complaint = {
        title: title,
        category: category,
        location: location,
        priority: priority,
        description: description
    };

    const response = await fetch(
        "http://localhost:3000/complaints",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(complaint)
        }
    );

    const data = await response.json();

    if (data.duplicate) {

        alert("Duplicate complaint!");

        return;
    }

    if (data.success) {

        alert("Complaint submitted successfully!");

        document.querySelector("form").reset();

        loadComplaints();
    }
}

// Show complaints to student
function showComplaints() {

    let box = document.getElementById("complaints");

    box.innerHTML = "";


    for (let i = 0; i < complaints.length; i++) {

        box.innerHTML += `

            <div class="issue">

                <h3>${complaints[i].title}</h3>

                <p>
                    <b>Category:</b>
                    ${complaints[i].category}
                </p>

                <p>
                    <b>Location:</b>
                    ${complaints[i].location}
                </p>

                <p>
                    <b>Priority:</b>
                    ${complaints[i].priority}
                </p>

                <p>
                    <b>Description:</b>
                    ${complaints[i].description}
                </p>

                <p class="status">
                    Status: ${complaints[i].status}
                </p>

            </div>

        `;
    }
}


// Show complaints to Admin
function showAdminComplaints() {

    let box = document.getElementById("adminComplaints");

    box.innerHTML = "";


    document.getElementById("total").innerText =
        complaints.length;


    let pending = 0;
    let resolved = 0;


    for (let i = 0; i < complaints.length; i++) {

        if (complaints[i].status == "Pending") {
            pending++;
        }

        if (complaints[i].status == "Resolved") {
            resolved++;
        }


        box.innerHTML += `

            <div class="issue">

                <h3>${complaints[i].title}</h3>

                <p>Location:
                    ${complaints[i].location}
                </p>

                <p>Priority:
                    ${complaints[i].priority}
                </p>

                <p>Status:
                    ${complaints[i].status}
                </p>

                <button onclick="resolveIssue(${i})">
                    Mark as Resolved
                </button>

            </div>

        `;
    }


    document.getElementById("pending").innerText =
        pending;

    document.getElementById("resolved").innerText =
        resolved;
}


// Resolve complaint
async function resolveIssue(id) {

    const response = await fetch(
        `http://localhost:3000/complaints/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: "Resolved"
            })
        }
    );

    const data = await response.json();

    if (data.success) {

        alert("Issue resolved!");

        loadAdminComplaints();
        loadComplaints();

    }
}



async function loadComplaints() {

    const response = await fetch(
        "http://localhost:3000/complaints"
    );

    const complaints =
        await response.json();


    let box =
        document.getElementById("complaints");

    box.innerHTML = "";


    complaints.forEach(function(complaint) {

        box.innerHTML += `

            <div class="issue">

                <h3>${complaint.title}</h3>

                <p>
                    Category:
                    ${complaint.category}
                </p>

                <p>
                    Location:
                    ${complaint.location}
                </p>

                <p>
                    Priority:
                    ${complaint.priority}
                </p>

                <p>
                    Status:
                    ${complaint.status}
                </p>

            </div>

        `;

    });

}

loadComplaints();

//Admin login

async function adminLogin() {

    let username =
        document.getElementById("adminUsername").value;

    let password =
        document.getElementById("adminPassword").value;


    const response = await fetch(
        "http://localhost:3000/admin-login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })
        }
    );


    const data = await response.json();


    if (data.success) {

        alert("Login successful!");

        document.getElementById(
            "adminLogin"
        ).style.display = "none";

        document.getElementById(
            "adminDashboard"
        ).style.display = "block";

        loadAdminComplaints();

    } else {

        alert("Wrong username or password!");

    }

}

async function loadAdminComplaints() {

    const response = await fetch(
        "http://localhost:3000/complaints"
    );

    const complaints =
        await response.json();


    let box =
        document.getElementById(
            "adminComplaints"
        );

    box.innerHTML = "";


    complaints.forEach(function(complaint) {

        box.innerHTML += `

            <div class="issue">

                <h3>${complaint.title}</h3>

                <p>
                    Location:
                    ${complaint.location}
                </p>

                <p>
                    Priority:
                    ${complaint.priority}
                </p>

                <p>
                    Status:
                    ${complaint.status}
                </p>

                <button
                    onclick="resolveIssue(${complaint.id})">

                    Mark as Resolved

                </button>

            </div>

        `;

    });

}

// async function resolveIssue(id) {

//     const response = await fetch(
//         `http://localhost:3000/complaints/${id}`,
//         {
//             method: "PUT",

//             headers: {
//                 "Content-Type": "application/json"
//             },

//             body: JSON.stringify({
//                 status: "Resolved"
//             })
//         }
//     );


//     const data = await response.json();


//     if (data.success) {

//         alert("Issue resolved!");

//         loadAdminComplaints();

//         loadComplaints();

//     }

// }