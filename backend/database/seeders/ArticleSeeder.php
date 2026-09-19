<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void {
    \App\Models\Article::create([
        'title' => '5 Fruits To Boost Your Health',
        'category' => 'Healthy Eating',
        'author_name' => 'Muriel Prosacco',
        'author_role' => 'Dietitian / Nutritionist',
        'author_avatar' => 'https://i.pravatar.cc/150?u=1',
        'image' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400',
        'is_top' => true
    ]);

    \App\Models\Article::create([
        'title' => "What's Causing Your Blood shot Eyes?",
        'category' => 'Eye',
        'author_name' => 'Muriel Prosacco',
        'author_role' => 'Eye Specialist',
        'author_avatar' => 'https://i.pravatar.cc/150?u=2',
        'image' => 'https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=400',
        'is_top' => false
    ]);
}
}
