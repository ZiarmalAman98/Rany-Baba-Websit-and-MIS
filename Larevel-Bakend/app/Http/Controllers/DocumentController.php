<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class DocumentController extends Controller
{

    public function index(Request $request)
    {
        $documents = Document::where('car_id', $request->id)->get();
        $car = Car::where('id', $request->id)->first();

        return response()->json([
            'success' => true,
            'data' => [
                'documents' => $documents,
                'car' => $car
            ]
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpeg,png,jpg|max:3072',
            'document_name' => 'required|string',
            'car_id' => 'required|exists:cars,id'
        ]);

        $document = new Document();
        $document->document_name = $request->document_name;

        if ($request->hasFile('file')) {
            $extension = $request->file('file')->getClientOriginalExtension();
            $filename = Str::random(20) . '.' . $extension;
            $request->file('file')->move('upload/car/file/', $filename);
            $document->file = $filename;
        }

        $document->car_id = $request->car_id;
        $document->user_id = Auth::id();
        $document->save();

        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully',
            'document' => $document
        ], 201);
    }


    public function show($id)
    {
        $document = Document::findOrFail($id);

        return response()->json([
            'success' => true,
            'document' => $document
        ]);
    }


    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully'
        ]);
    }
}
