import { ReactComponent as LogoVertical } from '../Assets/logo-vertical.svg';
import { ReactComponent as Heart } from '../Assets/Icons/heart.svg';
import * as ROUTES from '../Consts/Routes';
import './LandingPage.css';
import Button from '../Components/Button/Button';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <section className='-desktop-width-limit'>
      <header className='mb-48 landing__header'>
        <div className='mb-32'>
          <LogoVertical />
        </div>
        <h1 className='landing__heading -text-size-h3'>
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
          <p className='landing__feature-description'>
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
          <p className='landing__feature-description'>
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
          <p className='landing__feature-description'>
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
          <p className='landing__feature-description'>
            View your saved spots and others’ recommendations on an interactive
            map, making it simple to plan your next adventure or spontaneous
            detour.
          </p>
        </li>
      </ul>
      <p className='landing__feature-cta -text-size-h4 -is-cta'>
        Discover new adventures and hidden gems effortlessly with our app!
      </p>
      <div className='column -is-centred-v -has-spearator'>
        <Button fullWidth>
          <Link to={ROUTES.LOG_IN}>Log in</Link>
        </Button>
      </div>
      <div className='column -is-centred-v'>
        <p>Not a member?</p>
        <Link to={ROUTES.SIGN_UP}>Sign up</Link>
      </div>
    </section>
  );
};

export default LandingPage;
