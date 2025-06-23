<?php

namespace App\Http\Controllers\Api;

use App\Models\Survey;
use Illuminate\Http\Request;
use App\Models\SurveyQuestion;
use App\Http\Controllers\Controller;

class SurveyQuestionController extends Controller
{
    public function store(Request $request, Survey $survey)
    {
        $request->validate([
            'question_text' => 'required|string',
        ]);

        $question = $survey->questions()->create([
            'question_text' => $request->question_text,
        ]);

        return response()->json($question, 201);
    }

    public function destroy($id)
    {
        $question = SurveyQuestion::findOrFail($id);
        $question->delete();
        return response()->json(['message' => 'Question deleted']);
    }
}
