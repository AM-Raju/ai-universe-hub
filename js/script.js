// Grabbing Elements
const modalSection = document.getElementById("modal-section");
const seeMoreBtn = document.getElementById("see-more");
const loading = document.getElementById("loading");
const sortByDate = document.getElementById("sort-by-date");
const cardContainer = document.getElementById("card-container");

// Loading all Ai data
const loadAiDataFn = async (limit) => {
  try {
    const url = "https://openapi.programming-hero.com/api/ai/tools";
    const res = await fetch(url);
    const data = await res.json();
    let allAi = data.data.tools;
    console.log(allAi, "one");
    //=============================
    sortByDate.addEventListener("click", () => {
      document.getElementById("card-container").innerHTML = "";
      allAi = sortByDateFn(allAi);
      displayAiDataFn(allAi, limit);
    });
    //=============================
    displayAiDataFn(allAi, limit);
  } catch (err) {
    console.log(err);
  }
};

const sortByDateFn = (allAi) => {
  console.log(allAi, "Three");
  const customSort = (a, b) => {
    const dateA = new Date(a.published_in);
    const dateB = new Date(b.published_in);
    if (dateA > dateB) return 1;
    else if (dateA < dateB) return -1;
    return 0;
  };
  allAi.sort(customSort);
  return allAi;
};

// Displaying AI data
const displayAiDataFn = (allAi, limit) => {
  console.log(allAi, "Two");

  allAi.slice(0, limit).forEach((ai) => {
    const { id, name, image, published_in, features } = ai;
    //=================================================
    const orderedFn = (features) => {
      return `
      <ol class="list-decimal list-inside">
      ${features.map((feature) => `<li>${feature}</li>`).join("")}
      </ol>
      `;
    };
    //=================================================
    cardContainer.innerHTML += `
        <div class="border mx-auto lg:w-[485px] rounded-xl">
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
            <i onclick="loadAiDetailsFn('${id}')"
              class="open-modal fa-solid fa-arrow-right text-2xl text-red-400 bg-red-50 px-3 py-2 rounded-full"
            ></i>
          </div>
        </div>
      </div>
        `;
  });
  // remove loading button after data loading done
  loading.classList.add("hidden");
};

const loadAiDetailsFn = async (id) => {
  try {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data.data);
    displayAiDetailsFn(data.data);
  } catch (err) {
    console.log(err);
  }
};

// closing Modal
document.getElementById("close-modal").addEventListener("click", () => {
  modalSection.classList.add("hidden");
});

// Displaying single AI Details on Modal
const displayAiDetailsFn = (aiDetails) => {
  console.log(aiDetails);
  // Opening modal
  modalSection.classList.remove("hidden");
  const modalContainer = document.getElementById("modal-container");
  console.log(modalContainer);

  const { description, pricing, image_link, accuracy } = aiDetails;

  modalContainer.innerHTML = `
  <!-- Modal Block 1 -->
  <div
    class="mx-auto md:w-[500px] lg:w-[487px] bg-red-50 border border-red-200 p-8 rounded-xl text-center lg:text-left"
  >
    <h2 class="text-2xl font-semibold">
      ${description}
    </h2>

    <!-- Pricing -->
    <div
      class="sm:flex justify-between items-center my-8 text-xl lg:text-base text-center"
    >
      <div class="text-green-600 w-52 h-28 bg-white rounded-lg p-4 font-semibold">
        <h3>${pricing[0].price}</h3>
        <h3>${pricing[0].plan}</h3>
      </div>
      <div class="text-orange-600 w-52 h-28 bg-white rounded-lg p-4 my-5 lg:mx-5 font-semibold">
      <h3>${pricing[1].price}</h3>
      <h3>${pricing[1].plan}</h3>
      </div>
      <div class="text-red-600 w-52 h-28 bg-white rounded-lg p-4 font-semibold">
      <h3>${pricing[2].price}</h3>
      <h3>${pricing[2].plan}</h3>
      </div>
    </div>

    <!-- Features & Integrations -->
    <div class="md:flex justify-between">
      <div class="md:w-[200px]">
        <div class="text-2xl font-semibold mb-4">Features</div>
        <ul class="list-disc list-inside">
          <li>Customizable response.</li>
          <li>Multilingual Support</li>
          <li>Seamless integration</li>
        </ul>
      </div>
      <div class="md:w-[200px]">
        <div class="text-2xl font-semibold mb-4">Integrations</div>
        <ul class="list-disc list-inside">
          <li>Customizable response.</li>
          <li>Multilingual Support</li>
          <li>Seamless integration</li>
        </ul>
      </div>
    </div>
  </div>
  <!-- Modal block 2 -->
  <div class="lg:w-[487px] border border-gray-200 p-8 rounded-xl text-center">
    <button
      class="bg-red-500 px-3 py-1 rounded-md text-white relative lg:left-36 top-10 font-semibold"
    >
      ${accuracy.score * 100}% Accuracy
    </button>
    <img class="rounded-xl md:mx-auto" src="${image_link[0]}" alt="" />
    <h2 class="text-2xl font-semibold my-2">Hi, How are you doing today?</h2>
    <p>${accuracy.description}</p>
  </div>
  `;
};

// Action After See More Button clicked
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

const loadFeaturesFn = (id, features) => {
  console.log("features");
  console.log(id);
  console.log(features);
  const ol = document.getElementById("id");
  // features.forEach((feature) => {
  //   ol.innerHTML += `<li>${feature}</li>`;
  // });
};

loadAiDataFn(6);
