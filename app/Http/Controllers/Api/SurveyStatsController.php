<?php

namespace App\Http\Controllers\Api;

use App\Models\Survey;
use App\Models\SurveyAnswer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SurveyStatsController extends Controller
{
    public function index($id)
    {
        $survey = Survey::with('questions')->findOrFail($id);
        $answers = SurveyAnswer::where('survey_id', $id)->get();
        $totalRespondents = $answers->count();
        $statistics = [];

        foreach ($survey->questions as $question) {
            $counts = [];

            foreach ($answers as $answer) {
                $userAnswers = $answer->answers;

                if (isset($userAnswers[$question->id])) {
                    $value = $userAnswers[$question->id];
                    $counts[$value] = ($counts[$value] ?? 0) + 1;
                }
            }

            $statistics[] = [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'summary' => $counts,
            ];
        }

        return response()->json([
            'survey_id' => $survey->id,
            'title' => $survey->title,
            'responden_total' => $totalRespondents,
            'questions' => $statistics,
        ]);
    }
}
