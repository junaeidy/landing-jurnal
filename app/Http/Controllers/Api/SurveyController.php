<?php

namespace App\Http\Controllers\Api;

use App\Models\Survey;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SurveyController extends Controller
{
    public function index()
    {
        return Survey::withCount('questions', 'answers')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
        ]);

        $survey = Survey::create($request->only('title', 'description', 'start_at', 'end_at'));

        return redirect()->route('dashboard.surveys.index');
    }

    public function show($id)
    {
        return Survey::with('questions')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $survey = Survey::findOrFail($id);
        $survey->update($request->only('title', 'description', 'start_at', 'end_at'));
        return response()->json($survey);
    }

    public function destroy($id)
    {
        $survey = Survey::findOrFail($id);
        $survey->delete();
        return response()->json(['message' => 'Survey deleted']);
    }
}
