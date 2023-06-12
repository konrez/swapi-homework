const BASE_URL = "https://swapi.dev/api/";
let page = 1;
let currentCategory = "";
let isDetailsVisible = false;
let isUserInteracted = false;

const getButtons = async () => {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data;
};

const getData = async (category, page) => {
  const response = await fetch(`${BASE_URL}/${category}/?page=${page}`);
  const data = await response.json();
  const results = data.results;
  return results;
};

class Film {
  constructor(title, episode_id, director, created) {
    this.title = title;
    this.episode_id = episode_id;
    this.director = director;
    this.created = created;
  }
}

class Person {
  constructor(name, height, mass, created) {
    this.name = name;
    this.height = height;
    this.mass = mass;
    this.created = created;
  }
}

class Planet {
  constructor(name, climate, population, created) {
    this.name = name;
    this.climate = climate;
    this.population = population;
    this.created = created;
  }
}

class Species {
  constructor(name, classification, average_height, created) {
    this.name = name;
    this.classification = classification;
    this.average_height = average_height;
    this.created = created;
  }
}

class Starship {
  constructor(name, model, manufacturer, created) {
    this.name = name;
    this.model = model;
    this.manufacturer = manufacturer;
    this.created = created;
  }
}

class Vehicle {
  constructor(name, model, manufacturer, created) {
    this.name = name;
    this.model = model;
    this.manufacturer = manufacturer;
    this.created = created;
  }
}

const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

const createCollection = (category, data) => {
  switch (category) {
    case "films":
      return data.map(
        (item) =>
          new Film(
            item.title,
            item.episode_id,
            item.director,
            formatDate(item.created)
          )
      );
    case "people":
      return data.map(
        (item) =>
          new Person(
            item.name,
            item.height,
            item.mass,
            formatDate(item.created)
          )
      );
    case "planets":
      return data.map(
        (item) =>
          new Planet(
            item.name,
            item.climate,
            item.population,
            formatDate(item.created)
          )
      );
    case "species":
      return data.map(
        (item) =>
          new Species(
            item.name,
            item.classification,
            item.average_height,
            formatDate(item.created)
          )
      );
    case "starships":
      return data.map(
        (item) =>
          new Starship(
            item.name,
            item.model,
            item.manufacturer,
            formatDate(item.created)
          )
      );
    case "vehicles":
      return data.map(
        (item) =>
          new Vehicle(
            item.name,
            item.model,
            item.manufacturer,
            formatDate(item.created)
          )
      );
    default:
      return [];
  }
};

const playButtonSound = () => {
  if (isUserInteracted) {
    const buttonSound = document.getElementById("button-sound");
    buttonSound.play().catch((error) => {
      console.log("Failed to play button sound" , error);
    });
  }
};

const playYesMasterSound = () => {
  if (isUserInteracted) {
    const yesMasterSound = document.getElementById("yes-master");
    yesMasterSound.play().catch((error) => {
      console.log("Failed to play 'Yes, my master' sound", error);
    });
  }
};

const generateButtons = async () => {
  const buttonsContainer = document.getElementById("buttons");
  const buttonNames = Object.keys(await getButtons());

  buttonNames.forEach((name) => {
    const button = document.createElement("button");
    button.textContent = name;
    button.addEventListener("mouseover", () => {
      const buttonSound = document.getElementById("button-sound");
      buttonSound.play();
    });
    button.addEventListener("click", async () => {
      currentCategory = name;
      page = 1;
      const fetchedData = await getData(name, page);
      const collection = createCollection(name, fetchedData);
      generateTable(collection);
      updatePaginationButtons();
    });
    buttonsContainer.appendChild(button);
  });
};

const categoryProperties = {
  films: ["title", "episode_id", "director", "created"],
  people: ["name", "height", "mass", "created"],
  planets: ["name", "climate", "population", "created"],
  species: ["name", "classification", "average_height", "created"],
  starships: ["name", "model", "manufacturer", "created"],
  vehicles: ["name", "model", "manufacturer", "created"],
};

const generateTable = (collection) => {
  const tableContainer = document.querySelector(".chart_container");
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.id = "chart_table";

  const headerRow = document.createElement("tr");

  categoryProperties[currentCategory].forEach((property) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = property;
    headerRow.appendChild(headerCell);
  });

  table.appendChild(headerRow);

  collection.forEach((object) => {
    const dataRow = document.createElement("tr");

    categoryProperties[currentCategory].forEach((property) => {
      const dataCell = document.createElement("td");
      if (property === "created") {
        dataCell.textContent = formatDate(object[property]);
      } else {
        dataCell.textContent = object[property];
      }
      dataRow.appendChild(dataCell);
    });

    const detailsCell = document.createElement("td");
    const detailsButton = document.createElement("button");
    detailsButton.textContent = "DETAILS";
    detailsButton.addEventListener("click", () => {
      showDetails(object);
    });
    detailsCell.appendChild(detailsButton);

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "DELETE";
    deleteButton.id = "delete-button";
    deleteButton.addEventListener("click", () => {
      showConfirmation(object);
    });
    deleteCell.appendChild(deleteButton);

    dataRow.appendChild(detailsCell);
    dataRow.appendChild(deleteCell);

    table.appendChild(dataRow);
  });

  tableContainer.appendChild(table);
};

const updatePaginationButtons = () => {
  document.getElementById("currentPage").textContent = page.toString();
};

const initialize = async () => {
  await generateButtons();
  updatePaginationButtons();

  document.querySelector(".closeButton").addEventListener("click", hideDetails);
  document.querySelector(".details-view").addEventListener("click", (event) => {
    if (event.target.classList.contains("closeButton")) {
      hideDetails();
    }
  });
};

document.getElementById("previousButton").addEventListener("click", async () => {
  if (page > 1) {
    page--;
    await generateTable(await getData(currentCategory, page));
    updatePaginationButtons();
  }
});

document.getElementById("nextButton").addEventListener("click", async () => {
  page++;
  await generateTable(await getData(currentCategory, page));
  updatePaginationButtons();
});

document.getElementById("goToPageButton").addEventListener("click", async () => {
  const pageInput = document.getElementById("pageNumberInput").value;
  if (pageInput) {
    const pageNumber = parseInt(pageInput);
    if (pageNumber >= 1) {
      page = pageNumber;
      await generateTable(await getData(currentCategory, page));
      updatePaginationButtons();
    }
  }
});

const showDetails = (object) => {
  const detailsView = document.querySelector(".details-view");
  const detailsList = document.querySelector(".details-list");
  detailsList.innerHTML = "";
  detailsView.style.display = "block";

  for (const property in object) {
    const detailItem = document.createElement("div");
    const detailLabel = document.createElement("span");
    const detailValue = document.createElement("span");
    detailLabel.textContent = property;
    detailValue.textContent = object[property];
    detailItem.appendChild(detailLabel);
    detailItem.appendChild(detailValue);
    detailsList.appendChild(detailItem);
  }

  const closeButton = document.querySelector(".closeButton");
  closeButton.addEventListener("click", () => {
    hideDetails();
  });
};

const hideDetails = () => {
  const detailsView = document.querySelector(".details-view");
  const detailsList = document.querySelector(".details-list");
  detailsView.style.display = "none";
  detailsList.style.display = "none";
};

const showConfirmation = (object) => {
  const confirmationModule = document.getElementById("confirmationModule");
  confirmationModule.style.display = "block";

  const confirmDeleteButton = document.getElementById("confirmDelete");
  confirmDeleteButton.addEventListener("click", () => {
    playYesMasterSound();
    deleteObject(object);
    confirmationModule.style.display = "none";
  });

  const cancelDeleteButton = document.getElementById("cancelDelete");
  cancelDeleteButton.addEventListener("click", () => {
    playYesMasterSound();
    confirmationModule.style.display = "none";
  });
};

const deleteObject = (object) => {
  const table = document.getElementById("chart_table");
  const rowToDelete = Array.from(table.rows).find((row) => {
    const rowData = Array.from(row.cells).map((cell) => cell.textContent);
    return rowData.includes(object.name);
  });

  if (rowToDelete) {
    rowToDelete.remove();
  }
};

document.addEventListener("click", () => {
  isUserInteracted = true;
});

initialize();