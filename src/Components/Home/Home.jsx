import React from 'react';
import Hero from './Hero';
import EventsAll from './EventsAll';
import PopularSpeakers from './PopularSpeakers';
import BrowserByCategory from './BrowserByCategory';
import FeaturedOrganizers from './FeaturedOrganizers';
import Extra from './Extra';
import WhyChoseUs from './WhyChoseUs';

const Home = () => {
    return (
        <div>
            <Hero/>
            <EventsAll/>
               <PopularSpeakers/>
                <WhyChoseUs/>
               <FeaturedOrganizers/>
              
               <Extra/>
        <BrowserByCategory/>
         
        </div>
    );
};

export default Home;