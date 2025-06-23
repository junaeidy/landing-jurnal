<?php

namespace App\Http\Controllers\Api;

use App\Models\Survey;
use App\Models\SurveyAnswer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PublicSurveyController extends Controller
{
    public function showBySlug($slug)
    {
        $survey = Survey::with('questions')
            ->where('slug', $slug)
            ->where('start_at', '<=', now())
            ->where('end_at', '>=', now())
            ->firstOrFail();

        return response()->json($survey);
    }

    public function submitAnswer(Request $request, $slug)
    {
        $survey = Survey::where('slug', $slug)->firstOrFail();

        $request->validate([
            'answers' => 'required|array',
        ]);

        SurveyAnswer::create([
            'survey_id' => $survey->id,
            'answers' => $request->answers,
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['message' => 'Terima kasih atas partisipasi Anda!']);
    }
}