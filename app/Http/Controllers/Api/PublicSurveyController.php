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
            ->firstOrFail();

        if ($survey->start_at > now()) {
            return response()->json(['message' => 'Survey belum dimulai'], 403);
        }

        if ($survey->end_at < now()) {
            return response()->json(['message' => 'Survey sudah berakhir'], 410);
        }

        return response()->json($survey);
    }


    public function submitAnswer(Request $request, $slug)
    {
        $survey = Survey::where('slug', $slug)->firstOrFail();
        $ip = $request->ip();

        $alreadyAnswered = SurveyAnswer::where('survey_id', $survey->id)
            ->where('ip_address', $ip)
            ->exists();

        if ($alreadyAnswered) {
            return response()->json([
                'message' => 'Anda sudah pernah mengisi survey ini dari perangkat/IP yang sama.'
            ], 409);
        }

        $request->validate([
            'answers' => 'required|array',
        ]);

        $allowedChoices = ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"];

        foreach ($request->answers as $questionId => $value) {
            if (!in_array($value, $allowedChoices)) {
                return response()->json([
                    'message' => "Jawaban tidak valid untuk pertanyaan ID: $questionId"
                ], 422);
            }
        }

        SurveyAnswer::create([
            'survey_id' => $survey->id,
            'answers' => $request->answers,
            'ip_address' => $ip,
        ]);

        return response()->json([
            'message' => 'Terima kasih atas partisipasi Anda!'
        ]);
    }

    public function checkIfAnswered($slug, Request $request)
    {
        $survey = Survey::where('slug', $slug)->firstOrFail();

        $already = SurveyAnswer::where('survey_id', $survey->id)
            ->where('ip_address', $request->ip())
            ->exists();

        return response()->json(['alreadyAnswered' => $already]);
    }
}
