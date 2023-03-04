// ==================== Grabbing Elements ========================
const modalSection = document.getElementById("modal-section");
const seeMoreBtn = document.getElementById("see-more");
const loading = document.getElementById("loading");
const sortByDate = document.getElementById("sort-by-date");
const cardContainer = document.getElementById("card-container");
const modalContainer = document.getElementById("modal-container");

// =============== Loading all Ai data: Function ======================
const loadAiDataFn = async (limit) => {
  try {
    const url = "https://openapi.programming-hero.com/api/ai/tools";
    const res = await fetch(url);
    const data = await res.json();
    let allAi = data.data.tools;

    //============= Sorting Date Wise: EventListener ================
    sortByDate.addEventListener("click", () => {
      document.getElementById("card-container").innerHTML = "";
      allAi = sortByDateFn(allAi);
      displayAiDataFn(allAi, limit);
    });

    //=========== Function Call ===============
    displayAiDataFn(allAi, limit);
  } catch (err) {
    console.log(err);
  }
};

//============= Sorting Date Wise: Function ================
const sortByDateFn = (allAi) => {
  const customSort = (a, b) => {
    const dateA = new Date(a.published_in);
    const dateB = new Date(b.published_in);
    if (dateA < dateB) return 1;
    else if (dateA > dateB) return -1;
    return 0;
  };
  allAi.sort(customSort);
  return allAi;
};

// ============ Displaying AI data: Function =================
const displayAiDataFn = (allAi, limit) => {
  allAi.slice(0, limit).forEach((ai) => {
    const { id, name, image, published_in, features } = ai;

    // Dynamically adding features into the card
    const orderedFn = (features) => {
      return `
      <ol class="list-decimal list-inside h-[100px]">
      ${features.map((feature) => `<li>${feature}</li>`).join("")}
      </ol>
      `;
    };

    // Adding innerHtml into Card Container
    cardContainer.innerHTML += `
        <div class="border mx-auto lg:w-[485px] rounded-xl hover:bg-red-50 hover:transition-all">
        <div class="p-6 mx-auto">
          <img class="rounded-xl h-[245px]" src="${image}" alt="" />
          <h3 class="text-2xl font-semibold my-3">Features</h3>
          ${orderedFn(features)}
          <!-- line -->
          <div class="h-0.5 bg-gray-200 my-5"></div>
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-3xl font-semibold mb-3">${name}</h3>
              <p><i class="mr-3 fa-solid fa-calendar-days"></i>${published_in}</p>
            </div>
            <!-- Opening Modal and ai details function call -->
            <i onclick="loadAiDetailsFn('${id}')"
              class="open-modal fa-solid fa-arrow-right text-2xl text-red-400 bg-red-100 px-3 py-2 rounded-full"
            ></i>
          </div>
        </div>
      </div>
        `;
  });
  // remove loading button after data loading done
  loading.classList.add("hidden");
};

// ============== Loading Ai Details Data: Function ====================
const loadAiDetailsFn = async (id) => {
  try {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayAiDetailsFn(data.data);
  } catch (err) {
    console.log(err);
  }
};

// ============== closing Modal: Event Listener ==================
document.getElementById("close-modal").addEventListener("click", () => {
  modalSection.classList.add("hidden");
});

// ============== Displaying single AI Details on Modal: Function ==================
const displayAiDetailsFn = (aiDetails) => {
  // Opening modal
  modalSection.classList.remove("hidden");

  // Loading Features data into modal: Function
  const modalFeaturesFn = (featuresArr) => {
    return `
  <ul class="list-disc list-inside">
    ${featuresArr.map((list) => `<li>${list.feature_name}</li>`).join("")}
  </ul>
  `;
  };

  // Loading integrations data into modal: Function
  const modalIntegrationFn = (integrations) => {
    if (integrations === null) {
      return "No Data Found";
    } else {
      return `
    <ul class="list-disc list-inside">
    ${integrations.map((list) => `<li>${list}</li>`).join("")}
  </ul>
    `;
    }
  };

  // Show/Hide accuracy button
  const showHideBtn = (score) => {
    if (score === null) {
      return `
      <button
      class="hidden bg-red-500 px-3 py-1 rounded-md text-white relative lg:left-36 top-10 font-semibold"
    >
    </button>
      `;
    } else {
      return `
      <button
      class="bg-red-500 px-3 py-1 rounded-md text-white relative lg:left-36 top-10 font-semibold"
    >
      ${accuracy.score * 100}% Accuracy
    </button>
      `;
    }
  };

  // Destructuring object
  const {
    description,
    pricing,
    image_link,
    accuracy,
    features,
    integrations,
    input_output_examples,
  } = aiDetails;

  // Converting object value into array
  const featuresArr = Object.values(features);

  // Adding innerHtml into modal
  modalContainer.innerHTML = `
  <!-- Modal Block 1 -->
  <div
    class="mx-auto sm:w-[487px] lg:w-[500px] bg-red-50 border border-red-200 p-8 rounded-xl text-center lg:text-left"
  >
    <h2 class="text-2xl font-semibold">
      ${description}
    </h2>

    <!-- Pricing -->
    <div
      class="sm:flex justify-between items-center my-8 text-xl lg:text-base text-center"
    >
      <div class="text-green-600 w-52 h-28 bg-white rounded-lg p-4 font-semibold mx-auto">
        <h3>${pricing ? pricing[0].price : "Free of cost"}</h3>
        <h3>${pricing ? pricing[0].plan : ""}</h3>
      </div>
      <div class="text-orange-600 w-52 h-28 bg-white rounded-lg p-4 my-5 lg:mx-5 font-semibold mx-auto">
      <h3>${pricing ? pricing[1].price : "Free of cost"}</h3>
      <h3>${pricing ? pricing[1].plan : ""}</h3>
      </div>
      <div class="text-red-600 w-52 h-28 bg-white rounded-lg p-4 font-semibold mx-auto">
      <h3>${pricing ? pricing[2].price : "Free of cost"}</h3>
      <h3>${pricing ? pricing[2].plan : ""}</h3>
      </div>
    </div>

    <!-- Features & Integrations -->
    <div class="grid sm:grid-cols-2 gap-4 text-center sm:text-left">
      <div class="md:w-[200px]">
        <div class="text-2xl font-semibold mb-4">Features</div>
        ${modalFeaturesFn(featuresArr)}
      </div>
      <div class="md:w-[200px]">
        <div class="text-2xl font-semibold mb-4">Integrations</div>
          ${modalIntegrationFn(integrations)}
      </div>
    </div>
  </div>
  <!-- Modal block 2 -->
  <div class="lg:w-[487px] border border-gray-200 p-8 rounded-xl text-center mx-auto">
    ${showHideBtn(accuracy.score)}
    <img class="rounded-xl md:mx-auto" src="${image_link[0]}" alt="" />
    <h2 class="text-2xl font-semibold my-2">${
      input_output_examples ? input_output_examples[0].input : "No! Not yet! Take a Break"
    }</h2>
    <p>${input_output_examples ? input_output_examples[0].output : ""}</p>
  </div>
  `;
};

// =============== Action After See More Button clicked: EventListener ============
seeMoreBtn.addEventListener("click", () => {
  // Erasing existing card from container
  document.getElementById("card-container").innerHTML = "";
  // Start loading button before data load
  loading.classList.remove("hidden");
  // Removing see more button after loading data
  seeMoreBtn.classList.add("hidden");

  // Loading all cards
  loadAiDataFn();
});

loadAiDataFn(6);
