import Navbar from './navbar';
import { user } from '../config/user';

export default function Nav() {
  return <Navbar user={user} />;
}