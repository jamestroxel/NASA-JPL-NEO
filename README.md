![alt text](/documentation/nasa-jpl-neo-1.png)

# Impact Probability & Palermo Hazard Scale of NASA-Designated Near-Earth-Objects
This website continuously gathers data from Sentry, the NASA Jet Propulsion Lab's automated, near-earth object monitoring system, and displays important statistics about all asteroids currently under its observation. 

## Who is this for?
Freaks & weirdos, nihilists, fellow aesthetes, amateur astronomers, nerds, doomsday prophets, the
morbidly curious.

## How do I use it?
Priority was given to two key variables:

### Impact Probability
This is represented by the degree of blur given to the black, circular silhouette of the asteroid in the background of each item. The sharper the silhouette, the higher the impact probability. 

This was created using d3 by dynamically generating unique svg `<def>` and feGaussianBlur `<filter>` tags for each item using the the Impact Probability values from the Sentry API. This value is shown on a logarithmic scale between the smallest probabilty value and 1.

### Palermo Hazard Rating
This is based on the tabulated impact date, impact probability, and impact energy. NASA essentially grades the danger of each NEO on a curve. The solid, virtical line indicates where on the curve each hazard score lands.

Variables like diameter are less important when evaluating overall risk. Describing an asteroid as being "the size of Texas" may sound impressive but mean very little if its impact probability is close to zero.