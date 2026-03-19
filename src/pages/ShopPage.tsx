import { useState } from 'react';
import { FilterSidebar } from '../components/FilterSidebar';
import { GameAccountCard } from '../components/GameAccountCard';
import { Banner } from '../components/Banner';

export function ShopPage() {
  const [selectedGame, setSelectedGame] = useState('Tất cả');

  const gameAccounts = [
    {
      id: '1',
      gameName: 'Liên Minh Huyền Thoại',
      rank: 'Kim Cương III',
      price: 2500000,
      image: 'https://images.unsplash.com/photo-1619017120498-872bb10a14a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFndWUlMjBvZiUyMGxlZ2VuZHMlMjBnYW1lfGVufDF8fHx8MTc3MDAyOTEwOHww&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      champions: '145/165 Tướng',
      skins: '89 Trang phục'
    },
    {
      id: '2',
      gameName: 'PUBG Mobile',
      rank: 'Chinh Phục',
      price: 1800000,
      image: 'https://images.unsplash.com/photo-1564049489314-60d154ff107d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJnJTIwbW9iaWxlJTIwZ2FtaW5nfGVufDF8fHx8MTc3MDEwMzA0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      timeLeft: '2 ngày',
      champions: 'UC: 18,500',
      skins: '156 Set đồ'
    },
    {
      id: '3',
      gameName: 'Minecraft',
      rank: 'Premium Account',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1759663173762-29a82ef36daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5lY3JhZnQlMjBnYW1lJTIwd29ybGR8ZW58MXx8fHwxNzcwMTAzMDQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      champions: 'Full quyền',
      skins: 'Java + Bedrock'
    },
    {
      id: '4',
      gameName: 'Genshin Impact',
      rank: 'AR 58',
      price: 3200000,
      image: 'https://images.unsplash.com/photo-1769709992557-45387590ae7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5zaGluJTIwaW1wYWN0JTIwZ2FtZXxlbnwxfHx8fDE3NzAwNDAxMDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      champions: '23 nhân vật 5⭐',
      skins: '12 vũ khí 5⭐'
    },
    {
      id: '5',
      gameName: 'FIFA Online 4',
      rank: 'VIP 15',
      price: 1500000,
      image: 'https://images.unsplash.com/photo-1520298064646-747b5051dbb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWZhJTIwZm9vdGJhbGwlMjBnYW1lfGVufDF8fHx8MTc3MDEwMzA0NHww&ixlib=rb-4.1.0&q=80&w=1080',
      verified: false,
      champions: '25 cầu thủ Icon',
      skins: 'BP: 850M+'
    },
    {
      id: '6',
      gameName: 'Liên Minh Huyền Thoại',
      rank: 'Cao Thủ',
      price: 4500000,
      image: 'https://images.unsplash.com/photo-1619017120498-872bb10a14a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFndWUlMjBvZiUyMGxlZ2VuZHMlMjBnYW1lfGVufDF8fHx8MTc3MDAyOTEwOHww&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      timeLeft: '1 ngày',
      champions: '165/165 Tướng',
      skins: '234 Trang phục'
    },
    {
      id: '7',
      gameName: 'PUBG Mobile',
      rank: 'Bách Kim',
      price: 950000,
      image: 'https://images.unsplash.com/photo-1564049489314-60d154ff107d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJnJTIwbW9iaWxlJTIwZ2FtaW5nfGVufDF8fHx8MTc3MDEwMzA0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      champions: 'UC: 8,200',
      skins: '78 Set đồ'
    },
    {
      id: '8',
      gameName: 'Genshin Impact',
      rank: 'AR 45',
      price: 1200000,
      image: 'https://images.unsplash.com/photo-1769709992557-45387590ae7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5zaGluJTIwaW1wYWN0JTIwZ2FtZXxlbnwxfHx8fDE3NzAwNDAxMDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      champions: '12 nhân vật 5⭐',
      skins: '6 vũ khí 5⭐'
    },
    {
      id: '9',
      gameName: 'Minecraft',
      rank: 'Premium + Cape',
      price: 680000,
      image: 'https://images.unsplash.com/photo-1759663173762-29a82ef36daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5lY3JhZnQlMjBnYW1lJTIwd29ybGR8ZW58MXx8fHwxNzcwMTAzMDQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      champions: 'Full quyền + Cape',
      skins: 'Optifine Cape'
    }
  ];

  const filteredAccounts = selectedGame === 'Tất cả'
    ? gameAccounts
    : gameAccounts.filter(account => account.gameName === selectedGame);

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />
      
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebar
              selectedGame={selectedGame}
              onGameChange={setSelectedGame}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {selectedGame === 'Tất cả' ? 'Tất cả tài khoản' : selectedGame}
              </h2>
              <p className="text-gray-600">
                {filteredAccounts.length} tài khoản
              </p>
            </div>

            {/* Account Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAccounts.map((account) => (
                <GameAccountCard key={account.id} {...account} />
              ))}
            </div>

            {filteredAccounts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy tài khoản phù hợp
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}