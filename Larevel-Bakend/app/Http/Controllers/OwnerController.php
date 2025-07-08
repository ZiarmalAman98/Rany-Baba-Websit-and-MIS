<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class OwnerController extends Controller
{
    /**
     * Display a listing of the owners.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // $owners = Owner::all();
        $owners = Owner::with(
            'sponser'
        )->get();
        return response()->json([
            'success' => true,
            'data' => $owners,
            'message' => 'مالکین په بریالیتوب سره ترلاسه شول'
        ]);
    }

    /**
     * Get owner info by code (ID)
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOwnerInfo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|exists:owners,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'د مالک کوډ سم نه دی'
            ], 404);
        }

        $owner = Owner::find($request->code);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $owner->id,
                'info' => $owner->name . " - " . $owner->father_name,
                'name' => $owner->name,
                'last_name' => $owner->last_name,
                'father_name' => $owner->father_name,
                'grand_fname' => $owner->grand_fname,
                'phone' => $owner->phone_number,
                'nic_number' => $owner->nic_number
            ],
            'message' => 'د مالک معلومات ترلاسه شول'
        ]);
    }

    /**
     * Store a newly created owner in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'grand_fname' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'owner_job' => 'required|string|max:255',
            'job_place' => 'required|string|max:255',
            'house_no' => 'required|string|max:50',
            'phone_number' => 'required|string|max:15',
            'permenant_prov_add' => 'required|exists:provinces,id',
            'permenant_dist_add' => 'required|exists:districts,id',
            'permenant_village' => 'required|string|max:255',
            'nic_number' => 'required|string|max:50',
            'current_prov_add' => 'required|exists:provinces,id',
            'current_dist_add' => 'required|exists:districts,id',
            'current_village' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'user_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $ownerData = $request->all();
            $ownerData['id'] = $request->owner_code;

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('owners', 'public');
                $ownerData['image'] = $imagePath;
            }

            $owner = Owner::create($ownerData);

            return response()->json([
                'success' => true,
                'data' => $owner,
                'message' => 'Owner created successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating owner',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified owner.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */

    public function show($id)
    {
        $owner = Owner::find($id);
        if (!$owner) {
            return response()->json([
                'success' => false,
                'message' => 'مالک ونه موندل شو'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $owner,
            'message' => 'مالک معلومات ترلاسه شول'
        ]);
    }

    public function ownerprint($id)
    {
        $owner = Owner::with(
            'permanentProvince:id,name',
            'permanentDistrict:id,name',
            'currentProvince:id,name',
            'currentDistrict:id,name'
        )->find($id);

        Log::info("Owner:", ['owner' => $owner, 'id' => $id]);

        if (!$owner) {
            return response()->json([
                'success' => false,
                'message' => 'مالک ونه موندل شو'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $owner,
            'message' => 'مالک معلومات ترلاسه شول'
        ]);
    }


    /**
     * Update the specified owner in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        Log::info("Data",$request->all(),$id);
        $owner = Owner::find($id);

        if (!$owner) {
            return response()->json([
                'success' => false,
                'message' => 'مالک ونه موندل شو د تازه کولو لپاره'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'grand_fname' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'owner_job' => 'required|string|max:255',
            'job_place' => 'required|string|max:255',
            'house_no' => 'required|string|max:50',
            'phone_number' => 'required|string|max:15',
            'permenant_prov_add' => 'required|exists:provinces,id',
            'permenant_dist_add' => 'required|exists:districts,id',
            'permenant_village' => 'required|string|max:255',
            'nic_number' => 'required|string|max:50',
            'current_prov_add' => 'required|exists:provinces,id',
            'current_dist_add' => 'required|exists:districts,id',
            'current_village' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'user_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'مهرباني وکړئ د معلوماتو سم شکل ورکړئ'
            ], 422);
        }

        try {
            $ownerData = $request->all();

            if ($request->hasFile('image')) {
                // که زوړ تصویر موجود وي، حذف یې کړئ
                if ($owner->image && Storage::disk('public')->exists($owner->image)) {
                    Storage::disk('public')->delete($owner->image);
                }

                // نوی تصویر ثبت کړئ
                $imagePath = $request->file('image')->store('owners', 'public');
                $ownerData['image'] = $imagePath;
            }

            $owner->update($ownerData);

            return response()->json([
                'success' => true,
                'data' => $owner,
                'message' => 'د مالک معلومات په بریالیتوب سره تازه شول'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'تغیرات ثبت نشو!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified owner from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $owner = Owner::find($id);

        if (!$owner) {
            return response()->json([
                'success' => false,
                'message' => 'مالک ونه موندل شو د حذف کولو لپاره'
            ], 404);
        }

        $owner->delete();

        return response()->json([
            'success' => true,
            'message' => 'مالک په بریالیتوب سره حذف شو'
        ]);
    }

    /**
     * Get the maximum owner ID.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMaxId()
    {
        $maxId = Owner::max('id');
        return response()->json([
            'success' => true,
            'max_id' => $maxId,
            'message' => 'د مالکونو د اعظمي شمېرې ترلاسه کول'
        ]);
    }

    /**
     * Get the owner by district.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function per_district(Request $request)
    {
        $districtId = $request->input('district_id');
        $owners = Owner::where('district_id', $districtId)->get();

        return response()->json([
            'success' => true,
            'data' => $owners,
            'message' => 'د ولسوالۍ په اساس مالکین ترلاسه شول'
        ]);
    }

    /**
     * Get the current district owners.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function cur_district(Request $request)
    {
        $districtId = $request->input('district_id');
        $owners = Owner::where('district_id', $districtId)->get();

        return response()->json([
            'success' => true,
            'data' => $owners,
            'message' => 'د اوسنۍ ولسوالۍ مالکین ترلاسه شول'
        ]);
    }
}
