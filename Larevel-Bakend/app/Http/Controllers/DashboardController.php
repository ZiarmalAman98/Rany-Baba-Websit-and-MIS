<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Direction;
use App\Models\Owner;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use function Laravel\Prompts\table;

class DashboardController extends Controller
{
    public function index()
    {
        $owners = DB::table('owners as owner')
            ->join('users as user', 'owner.user_id', 'user.id')
            ->select(DB::raw('owner.id, owner.name, owner.last_name, owner.created_at, owner.father_name,owner.grand_fname,owner.phone_number,owner.nic_number,user.name as user_name'))
            ->get();
        return view("admin.dashboard", compact('owners'));
    }



    public function filter(Request $request)
    {
        $from = $request->from;
        $to = $request->to;

        $owners = DB::table('owners as owner')
            ->join('users as user', 'owner.user_id', 'user.id')
            ->select(DB::raw('owner.id, owner.name, owner.last_name,  owner.created_at,owner.father_name,owner.grand_fname,owner.phone_number,owner.nic_number,user.name as user_name'))->whereDate('owner.created_at', '>=', $from)->whereDate('owner.created_at', '<=', $to)
            ->get();
        return view("admin.dashboard", compact('owners'));
    }
}
