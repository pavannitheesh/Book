import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Input } from './ui/input';
import { Select } from './Select';
import { X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSearch = false
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterGenre, setFilterGenre] = React.useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userInitial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '?';
  const userAvatar = userInfo.avatar;

  const Logout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-16 p-4">
        <nav>
          <div className="flex items-center justify-between mb-4 p-4 bg-card shadow-sm border">
            <h1 className="text-2xl font-bold mb-4">Book Collection</h1>
            {showSearch && (
              <div className="flex space-x-4">
                <Input 
                  type="text" 
                  placeholder="Search books..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg bg-input pl-10 pr-14 sm:w-[200px] lg:w-[336px]"
                />
                <div className="flex items-center gap-2">
                  <Select 
                    value={filterGenre}
                    onValueChange={setFilterGenre}
                    onChange={(value: React.SetStateAction<string>) => setFilterGenre(value)} 
                  />
                  {filterGenre && (
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-red-500"
                      onClick={() => setFilterGenre('')}
                    />
                  )}
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
                <Link to="/addbook">
                  <Button>Add Book</Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Button className="ml-2" onClick={Logout}>Log out</Button>
                  <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground text-xl flex items-center justify-center font-semibold overflow-hidden">
                    {userAvatar ? (
                      <img 
                        src={userAvatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.textContent = userInitial;
                        }}
                      />
                    ) : userInitial}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {React.cloneElement(children as React.ReactElement, {
          searchTerm,
          setSearchTerm,
          filterGenre,
          setFilterGenre
        })}
      </div>
    </div>
  );
};

export default Layout;