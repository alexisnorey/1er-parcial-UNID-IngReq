const locations_container = document.querySelector("#locations_container")
const prevPage = document.querySelector("#prev_page")
const nextPage = document.querySelector("#next_page")
const currentPage = document.querySelector("#current_page")

document.addEventListener("DOMContentLoaded", () => {
  loadDataPage()
})

prevPage.addEventListener("click", e => {
  e.preventDefault()
  const link = prevPage.getAttribute("href")
  loadDataPage(link)
})

nextPage.addEventListener("click", e => {
  e.preventDefault()
  const link = nextPage.getAttribute("href")
  loadDataPage(link)
})

const loadDataPage = async (link = 'https://rickandmortyapi.com/api/location') => {
  const response = await fetch(link)
  const data = await response.json()
  const locations = data.results
  const metadata = data.info

  locations_container.innerHTML = renderLocations(locations)

  const page = link.split("=")
  currentPage.textContent = page[1] || 1
  paginationNav(metadata)
}

const paginationNav = (metadata) => {
  const totalPages = document.querySelector("#total_pages")
  totalPages.textContent = metadata.pages

  prevPage.classList.toggle("hidden", !metadata.prev)
  nextPage.classList.toggle("hidden", !metadata.next)

  prevPage.setAttribute("href", metadata.prev || "#")
  nextPage.setAttribute("href", metadata.next || "#")
}

const renderLocations = (locations) => {
  return locations.map(location => {
    const residentCount = location.residents.length
    return `
      <div class="character-card" data-location-id="${location.id}">
        <a href="location-profile.html?id=${location.id}">
          <div class="card-body-custom">
            <h3 class="card-name">${location.name}</h3>
            <p class="card-species">${location.type} &middot; ${location.dimension}</p>
            <div class="card-footer">
              <span class="card-origin">${residentCount} residente${residentCount !== 1 ? 's' : ''}</span>
              <button class="card-btn" type="button">
                Ver más
                <span class="card-btn-arrow">&rarr;</span>
              </button>
            </div>
          </div>
        </a>
      </div>
    `
  }).join("")
}

const filterState = { name: "", type: "", dimension: "" }

function filterUrl() {
  const p = new URLSearchParams()
  if (filterState.name)      p.set("name", filterState.name)
  if (filterState.type)      p.set("type", filterState.type)
  if (filterState.dimension) p.set("dimension", filterState.dimension)
  const q = p.toString()
  return `https://rickandmortyapi.com/api/location${q ? "?" + q : ""}`
}

document.querySelector(".filter-search").addEventListener("input", function () {
  filterState.name = this.value
  loadDataPage(filterUrl())
})

document.querySelectorAll(".filter-select").forEach(sel => {
  sel.addEventListener("change", function () {
    const key = this.dataset.filter
    filterState[key] = this.value
    loadDataPage(filterUrl())
  })
})