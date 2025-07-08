@extends('layouts.app')
@section('title', 'ضامن')
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

                <div class="card card-header" style="background-color: rgb(222, 168, 168); border-radius:0px;">
                    <h5 style="text-align: center;"> نوی ضامن داخلول </h5>
                </div>
                <div id="std_card_body" class="card-body" style="text-align:right;">
                    <form id="std_reg" method="post" action="{{ route('sponser.store') }}" enctype="multipart/form-data"
                        dir="rtl">
                        @csrf
                        <h4 class="text-center">د مالک شهرت</h4>
                        <div class="row">
                            <div class="col-lg-1">
                            </div>
                            <div class="col-lg-5 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="owner_code">د مالک کوډ<span style="color: red"> * </span></label>
                                    <input type="text" class="form-control text-right" id="owner_code" name="owner_code"
                                        required="required" pattern="[0-9]*[۰-۹]*" title="یوازې نمبر داخل کړئ" />
                                </div>
                            </div>
                            <div class="col-lg-5 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <div class="form-group form-group-sm">
                                    <label for="owner_info">د مالک پیژندنه</label>
                                    <input type="text" class="form-control text-right" readonly="readonly"
                                        id="owner_info" name="owner_info" />
                                </div>
                            </div>

                            <div class="col-lg-1">
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <h5>دضامن معلومات داخل کړئ</h5>
                                <div class="form-group form-group-sm ">
                                    <label for="sponser_name">ضامن نوم </label>
                                    <input type="text" placeholder="د ضامن پښتو نوم" class="form-control text-right"
                                        id="sponser_name" name="sponser_name" required="required"
                                        pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                        title="یوازې پښتو الفبا توري داخل کړئ" />
                                    <div style="color:red"> {{ $errors->first('sponser_name') }}</div>
                                </div>

                                <div class="form-group form-group-sm">
                                    <label for="sponsor_fname">د پلار نوم</label>
                                    <input type="text" placeholder="د ضامن د پلار پښتو نوم" class="form-control"
                                        id="sponsor_fname" name="sponsor_fname" required="required"
                                        pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسشښصضطظعغفقکګلمنڼږهءی۰يېئۍ\s]*"
                                        title="یوازې پښتوالفبا توري داخل کړئ" />
                                </div>
                                <div class="form-group form-group-sm ">
                                    <label for="phone_number">د موبایل نمبر</label>
                                    <input type="text" value="۰" name="phone_number" class="form-control"
                                        id="phone_number" pattern="[۰-۹]*[0-9]*" title="یوازې نمبر داخل کړئ" />
                                    <div style="color:red"> {{ $errors->first('phone_number') }}</div>
                                </div>






                                <div class="form-group form-group form-group-sm col-md-12 col-sm-12 col-xs-12">
                                    <label>جنسیت</label>
                                    <select class="form-group form-group form-group-sm col-md-12 col-sm-12 col-xs-12"
                                        name="gender" required>
                                        <option value="male">نارینه</option>
                                        <option value="female">ښځینه</option>

                                    </select>

                                </div>





                            </div>
                            <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center"> د عکس اپلوډ</h5>

                                <div class="form-group form-group-sm">
                                    <label for="approval_barharli">د برحالۍ تائیدي</label>
                                    <textarea class="form-control" rows="4" name="approval_barharli" id="approval_barharli"></textarea>
                                    <div style="color:red"> {{ $errors->first('approval_barharli') }}</div>
                                </div>


                                <div class="form-group form-group-sm">
                                    <label for="sponsor_image">د ضامن عکس</label>
                                    <input id="std_img" class="form-control" type="file" onchange="loadFile(event)"
                                        name="sponsor_image" id="sponsor_image" />
                                </div>

                                <div class="form-group form-group-sm text-center">
                                    <img id="output" src="{{ asset('icons/file_icon.png') }}" id="selected_img"
                                        alt="Preview" height="100" width="87" />
                                </div>

                            </div>
                            <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center">د ضامن اصلی سکونت</h5>
                                <div class="form-group form-group-sm">
                                    <label for="pro">ولایت</label>
                                    <select class="form-control" id="per_pro_id" required="required"
                                        name="permenant_prov_add">
                                        <option class="text-right" value="0">ولایت انتخاب کړئ</option>
                                        @foreach ($provinces as $province)
                                            <option value="{{ $province->id }}">{{ $province->name }}</option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="dis">ولسوالی</label>
                                    <select class="form-control" id="permenant_dis_add" required="required"
                                        name="permenant_dis_add" />

                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="permenant_village">کلی</label>
                                    <input type="text" value="" name="permenant_village" required="required"
                                        class="form-control" id="vil"
                                        pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />
                                </div>

                            </div>

                            <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                                <h5 class="text-center">د ضامن فعلی سکونت</h5>

                                <div class="form-group form-group-sm">
                                    <label for="pro2">ولایت</label>
                                    <select class="form-control" id="cur_pro_id" required="required"
                                        name="current_prov_add" />
                                    <option class="text-right" value="0">ولایت انتخاب کړئ</option>
                                    @foreach ($provinces as $province)
                                        <option value="{{ $province->id }}">{{ $province->name }}</option>
                                    @endforeach
                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="dis2">ولسوالی</label>
                                    <select class="form-control" id="current_dis_add" required="required"
                                        name="current_dis_add">

                                    </select>
                                </div>
                                <div class="form-group form-group-sm">
                                    <label for="current_village">کلی</label>
                                    <input type="text" value="" name="current_village" class="form-control"
                                        id="current_village"
                                        pattern="[A-Za-z\s]*[۰آاأبپتټثجحخچڅځدذډرزؤړوږښسشصضطظعغفقکګلمنڼږهءیيېئۍ\s]*"
                                        title="یوازې الفبا توري داخل کړئ" />
                                </div>
                                <input type="submit" class="btn btn-success btn-md" id="submit" value="ثبت کول"
                                    name="submit" />
                                <input type="reset" class="btn btn-danger btn-md" value="پورتنی معلومات لری کول" />
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </form>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <hr style="border-bottom: 2px rgb(210, 37, 37) solid;" />
                    <h3 class="text-center">ټول ضامنین</h3>
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
                                <th rowspan="2" class="text-center">تغیر راوستل</th>
                                <th colspan="3" class="text-center">فعلي سکونت</th>
                                <th colspan="3" class="text-center">اصلی سکونت</th>
                                <th rowspan="2">د ضامن عکس</th>
                                <th rowspan="2"> د تلیفون نمبر</th>
                                <th rowspan="2">د ضامن پلار نوم </th>
                                <th rowspan="2">د ضامن نوم </th>
                                <th rowspan="2"> دنیکه نوم</th>
                                <th rowspan="2">د مالک د پلار نوم</th>
                                <th rowspan="2">د مالک نوم</th>
                                <th rowspan="2">ID</th>
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

                            @foreach ($get_sponsers as $sponser)
                                <tr>
                                    <td><a href="{{ route('sponser.edit', $sponser->id) }}"
                                            class="btn btn-md btn-danger">تغیر راوستل<i class="fa fa-edit"></i></a></td>

                                    <td>{{ $sponser->cur_village }}</td>
                                    <td>{{ $sponser->current_dist_name }}</td>
                                    <td>{{ $sponser->current_pro_name }}</td>
                                    <td>{{ $sponser->per_village }}</td>
                                    <td>{{ $sponser->per_dist_name }}</td>
                                    <td>{{ $sponser->per_provine_name }}</td>
                                    <td> <img src="upload/sponsor/{{ $sponser->sponsor_image }}"
                                            class="img img-responsive " height="50" width="50"></td>
                                    <td>{{ $sponser->phone_number }}</td>
                                    <td>{{ $sponser->sponsor_fname }}</td>
                                    <td>{{ $sponser->sponser_name }}</td>
                                    <td>{{ $sponser->grand_fname }}</td>
                                    <td>{{ $sponser->father_name }}</td>
                                    <td>{{ $sponser->name . '  ' . $sponser->last_name }}</td>
                                    <td>{{ $sponser->owner_code }}</td>
                                    <td>{{ $loop->iteration }}</td>
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
        $("#owner_code").blur(function() {
            var owner_code = $(this).val();
            //alert(medicineId);
            $.ajax({
                url: 'ajax/fill_owner',
                type: 'GET',
                cache: false,
                async: false,
                data: {
                    'owner_code': owner_code
                },
                success: function(data) {
                    $("#owner_info").val(data);
                    // alert(data);
                },
                error: function() {
                    alert("error");
                }
            });
        });



        $("#per_pro_id").change(function() {
            var province_id = $(this).val();
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
