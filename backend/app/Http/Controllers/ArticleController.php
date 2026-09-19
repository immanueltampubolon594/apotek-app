<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'category'     => 'required|string',
            'author_name'  => 'required|string',
            'author_role'  => 'required|string',
            'author_avatar'=> 'nullable|string',
            'image'        => 'required|string',
            'content'      => 'required|string',
            'is_top'       => 'boolean',
        ]);

        $article = Article::create([
            'title'         => $request->title,
            'category'      => $request->category,
            'author_name'   => $request->author_name,
            'author_role'   => $request->author_role,
            'author_avatar' => $request->author_avatar ?? 'https://i.pravatar.cc/150?u=admin',
            'image'         => $request->image,
            'content'       => $request->content,
            'is_top'        => $request->is_top ?? false,
        ]);

        return response()->json($article, 201);
    }
}