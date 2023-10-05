document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('guestDropdown');
    const selector = document.getElementById('guestSelector');
    if (dropdown && selector){
    // If clicked outside dropdown and selector
    if (!dropdown.contains(event.target) && event.target !== selector) {
        dropdown.classList.add('hidden');
    }
}
});
function toggleGuestDropdown() {
    const dropdown = document.getElementById('guestDropdown');
    
    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
    }
}
function incrementGuest(event, type) {
    event.stopPropagation();  // Ensure the event doesn't propagate to document
    const countElem = document.getElementById(type);
    countElem.innerText = parseInt(countElem.innerText) + 1;
    updateGuestCountDisplay();
}

function decrementGuest(event, type) {
    event.stopPropagation();  // Ensure the event doesn't propagate to document
    const countElem = document.getElementById(type);
    let currentCount = parseInt(countElem.innerText);
    if (currentCount > 0) {
        countElem.innerText = currentCount - 1;
    }
    updateGuestCountDisplay();
}
function updateGuestCountDisplay() {
    const adultCount = parseInt(document.getElementById('adultCount').innerText);
    const childrenCount = parseInt(document.getElementById('childrenCount').innerText);
    const infantCount = parseInt(document.getElementById('infantCount').innerText);
    const petCount = parseInt(document.getElementById('petCount').innerText);

    const totalCount = adultCount + childrenCount + infantCount + petCount;

    document.getElementById('guestSelector').value = totalCount + (totalCount === 1 ? " Guest" : " Guests");
}

const searchButton = document.getElementById('searchButton');

if (searchButton) {
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    const searchValue = document.getElementById('searchInput').value;
    const checkinDate = document.getElementById('checkinDate').value;
    const checkoutDate = document.getElementById('checkoutDate').value;

    
    const adultCount = parseInt(document.getElementById('adultCount').innerText);
    const childrenCount = parseInt(document.getElementById('childrenCount').innerText);
    const infantCount = parseInt(document.getElementById('infantCount').innerText);
    const petCount = parseInt(document.getElementById('petCount').innerText);


    if (searchValue && checkinDate && checkoutDate) {
        console.log(searchValue)
        fetchListingsFromAirbnb(searchValue, checkinDate,checkoutDate ,adultCount, childrenCount, infantCount, petCount);
    } else {
        alert('Please enter a search value.');
    }
});
}

async function fetchListingsFromAirbnb(query, checkin, checkout,adult,children,infant,pet) {
    const url = `https://airbnb13.p.rapidapi.com/search-location?location=${query}&checkin=${checkin}&checkout=${checkout}&adults=${adult}&children=${children}&infants=${infant}&pets=${pet}&page=1&currency=USD`;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '2e6ea199b6mshf93ff7a776bbb19p18b203jsn38571d9b6a00',
		'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.text();  // or response.json() if the error body contains JSON data
throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData}`);

    }
	const result = await response.json();
	console.log(result);
   sessionStorage.setItem('hotelResults', JSON.stringify(result));
   window.open('listing.html', '_blank');
} catch (error) {
	console.error(error);
}
}
//fetchListingsFromAirbnb()
const resultsCountElement = document.getElementById('resultsCount');
document.addEventListener("DOMContentLoaded", function() {
    try {
        const data = JSON.parse(sessionStorage.getItem('hotelResults'));
        console.log(data);

        if(data && data.results && data.results.length) {
            const container = document.getElementById('resultsContainer') || document.body;
            const location = data.results[0].city || "Unknown Location"; 
            if(resultsCountElement){
            resultsCountElement.textContent = `${data.results.length} Stays in ${location}`;
            }
            data.results.forEach(result => {

            const title = result.price.priceItems[0].title;
            const regex = /\$(\d+) x (\d+) night/;
            const matches = title.match(regex);
            let price;
            let nights;
            if (matches) {
                price = matches[1];
                nights = matches[2];
            }
            const amenitiesString = result.previewAmenities.join(' · ');
            const formattedRating = parseFloat(result.rating || '0').toFixed(1);



               const house=document.createElement('div');
               house.className='house';
               house.innerHTML=`
               <div class="house-img">
               <a href="house.html"><img src="${result.images[0]}"></a>
           </div>
           <div class="house-info">
               <div class="name-det">
                   <div class="loc-name">
                       <p>${result.type} in ${result.city}</p>
                       <h3>${result.name}</h3>
                   </div>
                   

                   <div class="rare-indicator">
                <p id="israre"><img src="images/search_check_FILL0_wght400_GRAD0_opsz24.svg" alt="">Rare Finds</p>
                <p id="issuperhosted"><img src="images/badge.svg" alt="">Superhost</p>
            </div>
               </div>
               
               <p class="guest">${result.persons} guests · ${result.type} · ${result.beds} beds · ${result.bathrooms} bath · ${amenitiesString}</p>
                <div class="house-det">
                   <div class="house-ratings">
                       <p>${formattedRating} <img src="images/star.svg" alt="" srcset=""> <span>(${result.reviewsCount || '0 reviews'})</span></p>
           
                   </div>
                   <div class="house-price">
                       <h4>$${price} <span>/night</span></h4>
                   </div>
                </div>
               
           </div>
               `;
              

               house.addEventListener('click', function() {
                sessionStorage.setItem('selectedHouse', JSON.stringify(result));
                window.location.href = 'house.html';
            });
               container.appendChild(house);
               const superhostDiv=document.getElementById('issuperhosted');
               const rareDiv=document.getElementById('israre');
               if (result.isSuperhost) {
                superhostDiv.style.display = 'block'; 
            } else {
                superhostDiv.style.display = 'none'; 
            }

            if(result.rareFind){
                rareDiv.style.display='block';
            }else{
                rareDiv.style.display='none';
            }
            });
        }
    } catch (error) {
        console.error("Error parsing and displaying stored hotel results:", error);
    }
    //initMap();
});
let map;

function initMap() {
    // Default center for your map, can be any default coordinates.
    const data = JSON.parse(sessionStorage.getItem('hotelResults'));
    const defaultCenter = { lat: data.results[0].lat, lng: data.results[0].lng };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
       center: defaultCenter
    });

    

    if (data && data.results) {
        data.results.forEach(result => {
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lng);
            
            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    title: result.name || "Unnamed Location"
                });
            } else {
                console.warn("Invalid coordinates for result:", result);
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('listingPage')) {
        initMap();
    }
});