@extends('layouts.app')
@section('title', 'ډریور پاڼه')
@section('content')
    <br>
    <!-- Main content -->
    <section class="content" style="font-family: Bahij Zar;">
        <div class="container-fluid">

            <div class="card" style="border-radius: 0px;;">
                <div class="row" style="margin-top:20px;">

                    <div class="col-lg-6" style="text-align: right;">
                        <h5 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني
                            بـابـا </h5>
                    </div>
                    <div class="col-lg-6  text-left">
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
                <div class="card card-header" style="background-color: rgb(224, 148, 148); border-radius:0px;">
                    <h5 style="text-align: center; margin:0%;"> نوی ډریور داخلول </h5>
                </div>
                <div id="std_card_body" class="card-body" style="text-align:right;">
                    <form id="std_reg" method="post" action="{{ route('driver.store') }}" enctype="multipart/form-data"
                        dir="rtl">
                        @csrf
                        <div class="row">
                            <div class="col-lg-5 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center"> شهرت</h5>
                                <div class="row">
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="drive_name">نوم</label>
                                        <input type="text" placeholder="د  ډریور  نوم" class="form-control text-right"
                                            id="drive_name" name="drive_name" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="last_name">تخلص</label>
                                        <input type="text" placeholder="  تخلص نوم" class="form-control text-right"
                                            id="driver_lname" name="driver_lname" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="father_name">د پلار نوم</label>
                                        <input type="text" placeholder=" د پلار  نوم" class="form-control"
                                            id="father_name" name="driver_fname" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسشښصضطظعغفقکګلمنڼږهءی۰يېئۍ\s]*"
                                            title="یوازې پښتوالفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label>جنسیت</label>
                                        <select class="form-group form-group-sm col-md-12 col-sm-12 col-xs-12"
                                            name="gender" required>
                                            <option value="male">نارینه</option>
                                            <option value="female">ښځینه</option>

                                        </select>


                                    </div>

                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="nice_number">تزکري نمبر</label>
                                        <input type="text" placeholder="د تزکري نمبر داخل کړئ" class="form-control"
                                            id="height" name="nice_number" required="required" pattern="[۰-۹]*[0-9]*"
                                            title="یوازې نمبر توري داخل کړئ" />
                                        <div style="color: red;"> {{ $errors->first('nice_number') }}</div>
                                    </div>

                                    <div class="form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="phone_number">موبایل تمبر </label>
                                        <input type="text" value="" class="form-control" id=""
                                            name="phone_number" required="required" pattern="[۰-۹]*[0-9]*"
                                            title="یوازې نمبر توري داخل کړئ" />
                                        <div style="color: red;"> {{ $errors->first('phone_number') }}</div>
                                    </div>

                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="">توضیحات</label>
                                    <textarea type="text" placeholder="توضیحات" rows="1" class="form-control text-right" id="description"
                                        name="description"></textarea>
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center"> اصلی سکونت</h5>
                                <div class="form-group form-group-sm">
                                    <label for="pro">ولایت</label>
                                    <select class="form-control" id="per_pro_id" name="permenant_prov_add">
                                        <option class="text-right" value="0">ولایت انتخاب کړئ</option>
                                        @foreach ($provinces as $province)
                                            <option value="{{ $province->id }}">{{ $province->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="dis">ولسوالی</label>
                                    <select class="form-control" id="permenant_dis_add" name="permenant_dis_add" />

                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="permenant_village">کلی</label>
                                    <input type="text" value="" name="permenant_village" class="form-control"
                                        id="vil"
                                        pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />
                                </div>



                            </div>

                            <div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center"> فعلی سکونت</h5>

                                <div class="form-group form-group-sm">
                                    <label for="pro2">ولایت</label>
                                    <select class="form-control" id="cur_pro_id" name="current_prov_add" />
                                    <option class="text-right" value="0">ولایت انتخاب کړئ</option>
                                    @foreach ($provinces as $province)
                                        <option value="{{ $province->id }}">{{ $province->name }}</option>
                                    @endforeach
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="dis2">ولسوالی</label>
                                    <select class="form-control" id="current_dis_add" name="current_dis_add">
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="current_village">کلی</label>
                                    <input type="text" value="" name="current_village" class="form-control"
                                        id="current_village"
                                        pattern="[A-Za-z\s]*[۰آاأبپتټثجحخچڅځدذډرزؤړوږښسشصضطظعغفقکګلمنڼږهءیيېئۍ\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />
                                </div>


                            </div>

                            <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center"> د موټر معلومات </h5>

                                <div class="form-group form-group-sm">
                                    <label for="image">موټر انتخاب کړئ</label>
                                    <select id="car_id" name="car_id" class="form-control " lang="eng"
                                        style="width: 100;">
                                        <option value="0">موټر انتخاب کړئ</option>
                                        @foreach ($get_cars as $car)
                                            <option value="{{ $car->id }}">{{ $car->Engine_no }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group form-group-sm">
                                    <label for="direction">دموټر مسیر</label>
                                    <input type="text" id="direction" class="form-control" disabled="disabled" />
                                </div>

                                <div class="form-group form-group-sm" style="margin-top:20%;">
                                    <input type="submit" class="btn btn-success btn-md" id="submit" value="ثبت کول"
                                        name="submit" />
                                    <input type="reset" class="btn btn-danger btn-md" value=" معلومات لری کول" />
                                </div>


                            </div>

                            <div class="clearfix"></div>
                        </div>
                    </form>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <hr style="border-bottom: 2px gray solid;" />
                    <h3 class="text-center">ټول ډریوران</h3>
                    <hr>
                </div>

                <div class="col-lg-12 col-md-12 col-sm-12 table-responsive">
                    <style>
                        #example tr th,
                        #example tr td {
                            text-align: center;

                        }
                    </style>
                    <table id="example" class="table table-striped table-bordered text-right" width="100%"
                        cellspacing="0" dir="ltr">
                        <thead class="bg-gray">
                            <tr>
                                <th rowspan="2" class="text-center">عملیه</th>
                                <th rowspan="2" class="text-center">تغیرات راوستل</th>
                                <th colspan="3" class="text-center">فعلي سکونت</th>
                                <th colspan="3" class="text-center">اصلی سکونت</th>
                                <th rowspan="2">شاسي نمبر</th>
                                <th rowspan="2">انجن نمبر</th>
                                <th rowspan="2">پلیت نمبر</th>
                                <th rowspan="2"> د تذکیرې نمبر</th>
                                <th rowspan="2"> د تلیفون نمبر</th>
                                <th rowspan="2">جنسیت</th>
                                <th rowspan="2">د پلار نوم</th>
                                <th rowspan="2">تخلص</th>
                                <th rowspan="2">نوم</th>
                                <th rowspan="2">شماره</th>
                            </tr>
                            <tr>

                                <th>کلی</th>
                                <th>ولسوالی</th>
                                <th>ولایت</th>
                                <th>کلی</th>
                                <th>ولسوالی</th>
                                <th>ولایت</th>
                            </tr>
                        </thead>
                        <tbody>

                            @foreach ($get_drivers as $driver)
                                <tr>
                                    <td><a href="{{ route('driver.show', $driver->id) }}"
                                            class="btn btn-md btn-danger btn-responsive ">چاپ<i
                                                class="fa fa-print"></i></a></td>
                                    <td class="btn btn-md col-12">

                                        <a href="{{ route('driver.edit', $driver->id) }}"
                                            class="btn btn-sm btn-success">تغیرات راوستل<i class="fa fa-edit"></i></a>

                                                <a href="{{ route('qrcode', $driver->id) }}"
                                                    class="btn btn-sm btn-primary">بارکــــــــــــــود<i class="fa fa-edit"></i></a>

                                    </td>

                                    <td>{{ $driver->current_village }}</td>
                                    <td>{{ $driver->current_dist_name }}</td>
                                    <td>{{ $driver->current_pro_name }}</td>
                                    <td>{{ $driver->permenant_village }}</td>
                                    <td>{{ $driver->per_dist_name }}</td>
                                    <td>{{ $driver->per_provine_name }}</td>
                                    <td>{{ $driver->shase_no }}</td>
                                    <td>{{ $driver->Engine_no }}</td>
                                    <td>{{ $driver->plate_no }}</td>
                                    <td>{{ $driver->nice_number }}</td>
                                    <td>{{ $driver->phone_number }}</td>
                                    {{-- <td>{{$driver->job}}</td> --}}
                                    <td>{{ $driver->driver_fname }}</td>
                                    <td>{{ $driver->driver_lname }}</td>
                                    <td>{{ $driver->drive_name }}</td>
                                    <td>{{ $driver->id }}</td>
                                </tr>
                            @endforeach

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>


@endsection


@section('pageJs')
    <script>
        $("#car_id").change(function() {
            var car_id = $(this).val();
            // alert(car_id);
            $.ajax({
                url: 'ajax/fill_direction',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'car_id': car_id
                },
                success: function(data) {
                    $('#direction').val(data);
                    // alert(data);

                },
                error: function() {
                    alert('error');
                }
            });
        });


        $("#per_pro_id").change(function() {
            var province_id = $(this).val();
            // alert(province_id);
            $.ajax({
                url: 'ajax/fill_per_district',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'province_id': province_id
                },
                success: function(data) {
                    $('#permenant_dis_add').html(data);
                    // alert(data);

                },
                error: function() {
                    alert('error');
                }
            });
        });

        $("#cur_pro_id").change(function() {
            var cur_pro_id = $(this).val();
            $.ajax({
                url: 'ajax/fill_cur_district',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'cur_pro_id': cur_pro_id
                },
                success: function(data) {
                    $('#current_dis_add').html(data);
                    // alert(data);
                },
                error: function() {
                    alert('error');
                }
            });
        });
    </script>

@endsection
