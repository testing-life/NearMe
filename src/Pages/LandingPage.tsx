import { ReactComponent as LogoVertical } from '../Assets/logo-vertical.svg';
import { ReactComponent as Heart } from '../Assets/Icons/heart.svg';

const LandingPage = () => {
  return (
    <section>
      <header className='mb-48 landing__header'>
        <LogoVertical />
        <h1>
          Discover and save interesting places around you, effortlessly creating
          a personalised map of must-visit spots with photos, tags, and shared
          recommendations from others.
        </h1>
      </header>
      <ul className='mb-32 landing__feature-list'>
        <li className='landing__feature-list-item'>
          <span className='landing__feature-heading'>
            <Heart /> Instant Location Saving with Photos
          </span>
          <p>
            Add custom tags and notes to each spot, making it easy to categorise
            and remember why you wanted to visit these places in the first
            place.
          </p>
        </li>
        <li className='landing__feature-list-item'>
          <span className='landing__feature-heading'>
            <Heart />
            Community-Driven Discoveries
          </span>
          <p>
            Explore spots saved by other users within your vicinity, turning
            your city into a shared treasure map of hidden gems and local
            favourites.
          </p>
        </li>
        <li className='landing__feature-list-item'>
          <span className='landing__feature-heading'>
            <Heart />
            Instant Location Saving with Photos
          </span>
          <p>
            Capture and save the exact location of intriguing places you pass
            by, complete with photos and automatic reverse geolocation, so you
            never forget where to return
          </p>
        </li>
        <li className='landing__feature-list-item'>
          <span className='landing__feature-heading'>
            <Heart />
            Interactive Local Map
          </span>
          <p>
            View your saved spots and others’ recommendations on an interactive
            map, making it simple to plan your next adventure or spontaneous
            detour.
          </p>
        </li>
      </ul>
      <p className='mb-32'>
        Discover new adventures and hidden gems effortlessly with our app!
      </p>
    </section>
  );
};

export default LandingPage;
