<?php

namespace App\Http\Controllers\Api;

use App\Models\HomeHero;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class HomeHeroController extends Controller
{
    public function index()
    {
        $data = HomeHero::latest()->get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_id' => 'nullable|string',
            'title_en' => 'nullable|string',
            'subtitle_id' => 'nullable|string',
            'subtitle_en' => 'nullable|string',
            'cta_text_id' => 'nullable|string',
            'cta_text_en' => 'nullable|string',
            'cta_link' => 'nullable|url',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:2048',
        ]);

        $data = new HomeHero();
        $data->title = [
            'id' => $validated['title_id'],
            'en' => $validated['title_en'],
        ];
        $data->subtitle = [
            'id' => $validated['subtitle_id'],
            'en' => $validated['subtitle_en'],
        ];
        $data->cta_text = [
            'id' => $validated['cta_text_id'],
            'en' => $validated['cta_text_en'],
        ];
        $data->cta_link = $validated['cta_link'];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('home', 'public');
            $data->image = $path;
        }

        $data->save();

        return response()->json([
            'message' => 'Hero section created successfully',
            'data' => $data,
        ], 201);
    }

    public function show($id)
    {
        $data = HomeHero::findOrFail($id);
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $data = HomeHero::findOrFail($id);

        $validated = $request->validate([
            'title_id' => 'nullable|string',
            'title_en' => 'nullable|string',
            'subtitle_id' => 'nullable|string',
            'subtitle_en' => 'nullable|string',
            'cta_text_id' => 'nullable|string',
            'cta_text_en' => 'nullable|string',
            'cta_link' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:2048',
        ]);

        $data->title = [
            'id' => $validated['title_id'],
            'en' => $validated['title_en'],
        ];
        $data->subtitle = [
            'id' => $validated['subtitle_id'],
            'en' => $validated['subtitle_en'],
        ];
        $data->cta_text = [
            'id' => $validated['cta_text_id'],
            'en' => $validated['cta_text_en'],
        ];
        $data->cta_link = $validated['cta_link'];

        if ($request->hasFile('image')) {
            if ($data->image && Storage::disk('public')->exists($data->image)) {
                Storage::disk('public')->delete($data->image);
            }

            $path = $request->file('image')->store('home', 'public');
            $data->image = $path;
        }

        $data->save();

        return response()->json([
            'message' => 'Hero section updated successfully',
            'data' => $data,
        ]);
    }

    public function destroy($id)
    {
        $data = HomeHero::findOrFail($id);

        if ($data->image && Storage::disk('public')->exists($data->image)) {
            Storage::disk('public')->delete($data->image);
        }

        $data->delete();

        return response()->json(['message' => 'Hero section deleted successfully']);
    }
}
