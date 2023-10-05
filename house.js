document.addEventListener("DOMContentLoaded", function() {
    const houseData = JSON.parse(sessionStorage.getItem('selectedHouse'));
    console.log(houseData)
    if (houseData) {
        const gallery=document.querySelector('.gallery');
        gallery.innerHTML=`
        <div class="gallery-img-1"><img src="${houseData.images[0]}"></div>
            <div><img src="${houseData.images[1]}"></div>
            <div><img src="${houseData.images[2]}"></div>
            <div><img src="${houseData.images[3]}"></div>
            <div><img src="${houseData.images[4]}"></div>
        `;
        //sessionStorage.removeItem('selectedHouse');
        generateAmenitiesList(houseData.previewAmenities);
        showdetails(houseData);
        //renderPriceDetails(houseData);
        getratebreakdown(houseData);
    } else {
        console.error("No house data found.");
        // Handle this case - maybe redirect the user back to the listings or show an error
    }
});
const amenityIcons = {
    "Wifi": 'images/wifi.svg',
    "Air conditioning": 'images/ac.svg',
    "Self check-in": 'images/door.svg',
    "Kitchen":'images/kitchen.svg'
    
};

function getCancelPolicyDescription(policy) {
    switch(policy) {
        case "CANCEL_STRICT_14_WITH_GRACE_PERIOD":
            return {
                title: 'Free cancellation before Feb 14',
                subtitle: '50% refund up until 14 days before check-in'
            };

        case "CANCEL_MODERATE":
            return {
                title: 'Free cancellation 5 days before check-in',
                subtitle: '50% refund after that'
            };

        case "CANCEL_FLEXIBLE":
            return {
                title: 'Free cancellation 24 hours before check-in',
                subtitle: 'No refund after that'
            };

        case "CANCEL_BETTER_STRICT_WITH_GRACE_PERIOD":
            return {
                title: 'Better Strict Policy Title',
                subtitle: 'Description of the Better Strict Policy'
            };

        default:
            return {
                title: 'Cancellation policy not available.',
                subtitle: ''
            };
    }
}
function showdetails(houseData){
    const beddet=document.querySelector('.bed-det');
    const housetitle=document.querySelector('.house-title');
    const smalldetails=document.querySelector('.small-details');
    const detailslist=document.querySelector('.details-list');
    
    const addloc=document.querySelector('.add-loc');
    addloc.textContent=`
    ${houseData.address}
    `;
    const images = houseData.images;
    const formattedRating = parseFloat(houseData.rating || '0').toFixed(1);
    const randomImage = images[Math.floor(Math.random() * images.length)];
    beddet.innerHTML=`
    <h3>Where you'll sleep</h3>
    <img src="${randomImage}" alt="">
    <p>Bedroom</p>
    <p>${houseData.beds} bed</p>
    `;
    
    housetitle.innerHTML=`
    <h1>${houseData.name}</h1>
    <div class="row">
        <div>
            <span><img src="images/star-red.svg" alt="">${formattedRating}</span>
        </div>
        <div>
            <span>${houseData.reviewsCount} Reviews</span>
        </div>
        <div>
            <p> <img src="images/badge.svg" alt="" srcset="">Superhost</p>
        </div>
        <div>
            <p>${houseData.address}</p>
        </div>
    </div>
    `;
    const superhostDiv = document.querySelector('.row div:nth-child(3)'); 

if (houseData.isSuperhost) {
    superhostDiv.style.display = 'block'; 
} else {
    superhostDiv.style.display = 'none'; 
}
smalldetails.innerHTML=`
<div class="small-host-det">
<h2>${houseData.type}</h2>
<p>${houseData.persons} guest · ${houseData.beds} beds · ${houseData.bathrooms} bathroom</p>
</div>
<img src="${houseData.hostThumbnail}" alt="">
`;

const policyData = getCancelPolicyDescription(houseData.
    cancelPolicy); // Replace with actual policy type

detailslist.innerHTML=`
<li><img src="images/home.svg" alt=""><p>${houseData.type}
                        <span>You’ll have the apartment to yourself</span></p>
                    </li>
                    <li><img src="images/2star.svg" alt=""><p>Enhanced Clean
                        <span>This Host committed to Airbnb’s 5-step enhanced cleaning process. Show more</span></p>
                    </li>
                    <li><img src="images/door.svg" alt=""><p>Self check-in
                        <span>Check yourself in with the keypad.</span></p>
                    </li>
                    <li><img src="images/calendar.svg" alt=""> <p>${policyData.title}
                        <span>${policyData.subtitle}</span></p>
                    </li>
`;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        drawRoute(position.coords.latitude, position.coords.longitude, houseData.lat, houseData.lng);
    });
} else {
    alert("Geolocation is not supported by this browser.");
}
 
}


function generateAmenitiesList(amenities_data) {
    const amenties=document.querySelector('.amenties');
    const list = document.createElement('ul');
    list.className='all-amenties';
    amenities_data.forEach(amenity =>{
        const iconSrc = amenityIcons[amenity];
        const listItem = document.createElement('li');
        if (iconSrc) {
       listItem.innerHTML = `<img src="${iconSrc}" alt="">${amenity}`;
        }
        
       list.appendChild(listItem);
        
    });
    amenties.append(list);
}

let map;
let directionsService, directionsRenderer;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    const defaultCenter = { lat: 37.7749, lng: -122.4194 };  // Default to San Francisco. Adjust as needed.
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: defaultCenter
    });
    directionsRenderer.setMap(map);
}

function drawRoute(userLat, userLng, houseLat, houseLng) {
    const start = new google.maps.LatLng(userLat, userLng);
    const end = new google.maps.LatLng(houseLat, houseLng);
    
    const request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };
    
    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            const distance = result.routes[0].legs[0].distance.text;
            const adddist=document.querySelector('.add-dist');
            adddist.textContent=`The distance from your location is approximately ${distance}.`;
            
       
        } else {
            console.error(`Error fetching directions: ${status}`);
          
        }
    });
}
function getratebreakdown(houseData){
    const ratecontainer=document.querySelector('.right-house-container');
    const formattedRating = parseFloat(houseData.rating || '0').toFixed(1);
    const title = houseData.price.priceItems[0].title;
    const regex = /\$(\d+) x (\d+) night/;
    const matches = title.match(regex);
    let price;
   // let nights;
    if (matches) {
        price = matches[1];
      //  nights = matches[2];
    }
    const ratecard=document.createElement('div');
    ratecard.className='rate-card';
    ratecard.innerHTML=`
    <div class="price-ng">
    <p>$${price} <span>/night</span></p>
    <p><img src="images/star-red.svg" alt="">${formattedRating} · ${houseData.reviewsCount} reviews</p>
</div>
<div class="check-div">
    <div class="two-input">
        <div class="CONCAT-INPUT">
            <label for="Checkin">CHECK-IN</label>
            <input type="date">
        </div>
        <div class="CONCAT-INPUT">
            <label for="Checkin">CHECK-OUT</label>
            <input type="date" >
        </div>
    </div>
    
    <div class="CONCAT-INPUT biginput">
        <label for="Checkin">GUESTS</label>
        <input type="text" placeholder="guests">
    </div>
    
    
</div>
<button id="reserve">Reserve</button>
<div id="priceContainer">
    <!-- The price details will be appended here -->
</div>

<hr class="line-s">
<div class="pridiv">
    <p>Total</p>
    <p>$${houseData.price.total}</p>
</div>
</div>
    `;
    ratecontainer.appendChild(ratecard);
    renderPriceDetails(houseData);
    
}
function renderPriceDetails(houseData) {
    const priceContainer = document.getElementById('priceContainer');
    if (!priceContainer) {
        console.error("Price container not found!");
        return;
    }
    
    houseData.price.priceItems.forEach(item => {
        const priceDiv = document.createElement('div');
        priceDiv.className = 'pridiv';
        priceDiv.innerHTML = `
            <p>${item.title}</p>
            <p>$${item.amount}</p>
        `;
        priceContainer.appendChild(priceDiv);
    });
}