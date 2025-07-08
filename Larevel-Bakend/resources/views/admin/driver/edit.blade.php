@extends('layouts.app')
@section('title', 'ډریور معلومات تغیرول')
@section('content')
    <br>
    <!-- Main content -->
    <section class="content" style="font-family: Bahij Zar;">
        <div class="container-fluid">

            <div class="card" style="border-radius: 10px;">
                <div class="row" style="margin-top:20px;">

                    <div class="col-lg-6" style="text-align: right;">
                        <h5 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني
                            بـابـا </h5>
                    </div>
                    <div class="col-lg-6 text-left">
                        <span id="time" style="margin-left:10px;"></span>
                        <script>
                            window.setInterval(ut, 1000);

                            function ut() {
                                var d = new Date();
                                document.getElementById("time").innerHTML = d.toLocaleTimeString();
                            }
                        </script>
                    </div>

                </div>
                <div class="card-header" style="background-color: lightgray; border-radius:0px;">
                    <h5 style="text-align: center; margin:0%;">ډریور معلومات تغیرول</h5>
                </div>
                <div id="std_card_body" class="card-body" style="text-align:right;">
                    <form id="std_reg" method="post" action="{{ route('driver.update', $edit_driver) }}"
                        enctype="multipart/form-data" dir="rtl">
                        @csrf
                        @method('PUT')
                        <div class="row">
                            <div class="col-lg-5 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center">د ډریور شهرت</h5>
                                <div class="row">
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="drive_name">نوم</label>
                                        <input type="text" placeholder="د  ډریور  نوم"
                                            value="{{ $edit_driver->drive_name }}" class="form-control text-right"
                                            id="drive_name" name="drive_name" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="last_name">تخلص</label>
                                        <input type="text" placeholder="د ډریور  تخلص نوم"
                                            value="{{ $edit_driver->driver_lname }}" class="form-control text-right"
                                            id="driver_lname" name="driver_lname" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="father_name">د پلار نوم</label>
                                        <input type="text" placeholder=" د پلار  نوم" class="form-control"
                                            id="father_name" value="{{ $edit_driver->driver_fname }}" name="driver_fname"
                                            required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسشښصضطظعغفقکګلمنڼږهءی۰يېئۍ\s]*"
                                            title="یوازې پښتوالفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label>Gender:</label>
                                        <select name="gender" required>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="nice_number">تزکري نمبر</label>
                                        <input type="text" placeholder="د تزکري نمبر داخل کړئ" class="form-control"
                                            id="height" name="nice_number" value="{{ $edit_driver->nice_number }}"
                                            required="required" pattern="[۰-۹]*[0-9]*" title="یوازې نمبر توري داخل کړئ" />
                                    </div>

                                    <div class="form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="phone_number">موبایل تمبر </label>
                                        <input type="text" class="form-control" id="" name="phone_number"
                                            value="{{ $edit_driver->phone_number }}" required="required"
                                            pattern="[۰-۹]*[0-9]*" title="یوازې نمبر توري داخل کړئ" />
                                    </div>

                                </div>
                                <div class="form-group form-group-sm">
                                    <textarea type="text" placeholder="توضیحات" rows="1" class="form-control text-right" id="description"
                                        name="description">{{ $edit_driver->description }}</textarea>
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center">د ډریور اصلی سکونت</h5>
                                <div class="form-group form-group-sm">
                                    <label for="pro">ولایت</label>
                                    <select class="form-control" id="per_pro_id" name="permenant_prov_add">
                                        <option value="{{ $edit_driver->permenant_prov_add }}">
                                            {{ $edit_driver->per_province->name }}</option>
                                        @foreach ($provinces as $province)
                                            <option value="{{ $province->id }}">{{ $province->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="dis2">ولسوالی</label>
                                    <select class="form-control" id="permenant_dis_add" name="permenant_dis_add" />
                                    <option value="{{ $edit_driver->permenant_dis_add }}">
                                        {{ $edit_driver->per_disrict->name }}</option>

                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="permenant_village">کلی</label>
                                    <input type="text" value="{{ $edit_driver->permenant_village }}"
                                        name="permenant_village" class="form-control" id="vil"
                                        pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />
                                </div>
                            </div>

                            <div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center">د ډریور فعلی سکونت</h5>

                                <div class="form-group form-group-sm">
                                    <label for="pro2">ولایت</label>
                                    <select class="form-control" id="cur_pro_id" name="current_prov_add" />
                                    <option value="{{ $edit_driver->current_prov_add }}">
                                        {{ $edit_driver->cur_province->name }}</option>
                                    @foreach ($provinces as $province)
                                        <option value="{{ $province->id }}">{{ $province->name }}</option>
                                    @endforeach
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="dis2">ولسوالی</label>
                                    <select class="form-control" id="current_dis_add" name="current_dis_add">
                                        <option value="{{ $edit_driver->current_dis_add }}">
                                            {{ $edit_driver->cur_district->name }}</option>
                                    </select>
                                </div>

                                <div class="form-group form-group-sm">
                                    <label for="current_village">کلی</label>
                                    <input type="text" value="{{ $edit_driver->current_village }}"
                                        name="current_village" class="form-control" id="current_village"
                                        pattern="[A-Za-z\s]*[۰آاأبپتټثجحخچڅځدذډرزؤړوږښسشصضطظعغفقکګلمنڼږهءیيېئۍ\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />

                                </div>

                            </div>

                            <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center"> د موټر معلومات </h5>

                                <div class="form-group form-group-sm">
                                    <label for="image">موټر انتخاب کړئ</label>
                                    <select lang="eng" id="car_id" name="car_id" class="form-control">
                                        @foreach ($get_cars as $car)
                                            <option {{ $edit_driver->car_id == $car->id ? 'selected' : '' }}
                                                value="{{ $car->id }}">{{ $car->Engine_no }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group form-group-sm">
                                    <label for="direction">دموټر مسیر</label>
                                    <input type="text" id="direction" class="form-control" disabled="disabled" />
                                </div>

                                <input type="submit" class="btn btn-danger btn-md" id="submit" value="تغیرات راوستل"
                                    name="submit" />
                                <a href="{{ route('driver.index') }}" class="btn btn-success btn-md">واپس</a>
                            </div>

                            <div class="clearfix"></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

@endsection

@section('pageJs')

    <script>
        $("#car_id").change(function() {
            var car_id = $(this).val();
            $.ajax({
                url: '/ajax/fill_direction',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'car_id': car_id
                },
                success: function(data) {
                    $('#direction').val(data);
                },
                error: function() {
                    alert('error');
                }
            });
        });
        $("#per_pro_id").change(function() {
            var province_id = $(this).val();
            $.ajax({
                url: '/ajax/fill_per_district',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'province_id': province_id
                },
                success: function(data) {
                    $('#permenant_dis_add').html(data);
                },
                error: function() {
                    alert('error');
                }
            });
        });

        $("#cur_pro_id").change(function() {
            var cur_pro_id = $(this).val();
            $.ajax({
                url: '/ajax/fill_cur_district',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'cur_pro_id': cur_pro_id
                },
                success: function(data) {
                    $('#current_dis_add').html(data);
                },
                error: function() {
                    alert('error');
                }
            });
        });
    </script>

@endsection

<style>
    .btn {
        background-color: #a72848;
        /* سبز رنگ */
        color: white;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 14px;
        margin-top: 10px;
    }

    .btn:hover {
        background-color: #218838;
        /* ټیټه سبز رنگ */
    }

    .btn-md {
        width: 100%;
    }

    .form-control {
        border-radius: 5px;
        border: 1px solid #03740c;
        padding: 10px;
        font-size: 14px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    h5 {
        font-family: 'Bahij Titra', sans-serif;
        color: #333;
    }

    .card {
        border-radius: 10px;
    }

    .card-header {
        background-color: #da0f0f;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
    }

    select {
        border-radius: 5px;
        border: 1px solid #ddd;
        padding: 10px;
        font-size: 14px;
    }
</style>
