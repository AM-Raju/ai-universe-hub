const modalSection = document.getElementById("modal-section");

// Close modal
document.getElementById("close-modal").addEventListener("click", () => {
  modalSection.classList.add("hidden");
});

// Open modal
const items = document.getElementsByClassName("open-modal");
console.log(items);

for (let item of items) {
  console.log(item);
  item.addEventListener("click", () => {
    modalSection.classList.remove("hidden");
  });
}
