@extends('layouts.app')
@section('title', 'کورپاڼه')
@section('content')

    <br>

    <div class="container-fluid" style="font-family: Bahij Zar;">
        <div class="row">
            <div class="col-12 col-sm-6 col-md-3">
                <div class="info-box">
                    <span class="info-box-icon bg-primary elevation-1">
                        <a href="{{ route('car.index') }}">
                            <i style="color: yellow;" class="fa fa-truck"></i>
                        </a>
                    </span>
                    <div class="info-box-content">
                        <span class="info-box-text">ریکشو تعداد</span>
                        <span class="info-box-number">
                            {{ App\Models\Car::count('id') }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
                <div class="info-box mb-3">
                    <span class="info-box-icon bg-danger elevation-1">
                        <a href="{{ route('owner.index') }}">
                            <i class="fa fa-users"></i>
                        </a>
                    </span>
                    <div class="info-box-content">
                        <span class="info-box-text">مالکینو تعداد</span>
                        <span class="info-box-number">{{ App\Models\Owner::count('id') }}</span>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
                <div class="info-box mb-3">
                    <span class="info-box-icon bg-success elevation-1">
                        <a href="{{ route('sponser.index') }}">
                            <i class="fa fa-address-card"></i>
                        </a>
                    </span>
                    <div class="info-box-content">
                        <span class="info-box-text">ضامنینو تعداد</span>
                        <span class="info-box-number">{{ App\Models\Sponsor::count('id') }}</span>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
                <div class="info-box mb-3">
                    <span class="info-box-icon bg-warning elevation-1">
                        <a href="{{ route('driver.index') }}">
                            <i class="fa fa-male"></i>
                        </a>
                    </span>
                    <div class="info-box-content">
                        <span class="info-box-text">ډریورانو تعداد</span>
                        <span class="info-box-number">{{ App\Models\Driver::count('id') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <hr>

        <div class="card">
            <div class="card-body">
                <form method="GET" action="{{ route('dashboard') }}">
                    @csrf
                    <div class="text-center">
                        <h4>د ټولو مالکانو لیست</h4>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-lg-3 col-md-6 col-sm-12 mb-2">
                            <div class="form-group">
                                <input type="date" required name="from" class="form-control text-right">
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-sm-12 mb-2">
                            <div class="form-group">
                                <input type="date" required name="to" class="form-control text-right">
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-sm-12">
                            <button class="btn btn-success">
                                {{-- <i class="fa fa-search"></i> --}}
                                لټون
                            </button>
                            <a class="btn btn-info" href="{{ route('dashboard') }}">
                                {{-- <i class="fa fa-refresh"></i> --}}
                                تازه کول
                            </a>
                        </div>
                    </div>
                </form>

                <hr>

                <div class="table-responsive">
                    <style>
                        #example tr th,
                        #example tr td {
                            text-align: center;
                        }
                    </style>
                    <table id="example" class="table table-striped table-bordered" width="100%" cellspacing="0">
                        <thead>
                            <tr style="background-color: gray; font-size: 18px;">
                                <th>عملیه</th>
                                <th>کارمند نوم</th>
                                <th>د ثبت نیټه</th>
                                <th>موبایل شمیره</th>
                                <th>تزکري نمبر</th>
                                <th>دنیکه نوم</th>
                                <th>د پلار نوم</th>
                                <th>نوم او تخلص</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($owners as $owner)
                                <tr>
                                    <td>
                                        <a href="{{ route('dashboard', $owner->id) }}" class="btn btn-primary btn-sm">
                                            <i class="fa fa-cogs"></i> عملیه
                                        </a>
                                    </td>
                                    <td>{{ $owner->user_name }}</td>
                                    <td>{{ $owner->created_at }}</td>
                                    <td>{{ $owner->phone_number }}</td>
                                    <td>{{ $owner->nic_number }}</td>
                                    <td>{{ $owner->grand_fname }}</td>
                                    <td>{{ $owner->father_name }}</td>
                                    <td>{{ $owner->name . ' ' . $owner->last_name }}</td>
                                    <td>{{ $owner->id }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

@endsection
