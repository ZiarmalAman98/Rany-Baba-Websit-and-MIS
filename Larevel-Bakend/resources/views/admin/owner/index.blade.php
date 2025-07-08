@extends('layouts.app')
@section('title', 'مالک پاڼه')
@section('content')
    <br>
    <!-- Main content -->
    <section class="content" style="font-family: Bahij Zar;">
        <div class="container-fluid">
            <div class="card">
                <div class="row" style="margin-top:20px;">
                    <div class="col-lg-6" style="text-align: right;">
                        <h3 style="font-family: Bahij Titra; margin-right: 30px;">شرکت ترانســـــــپورټي ریکـــــشه راني
                            بـابـا </h3>
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
                <div class="card card-header" style="background-color:rgb(230, 183, 183);">
                    <div class="row">
                        <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10 pull-left">
                            <h4 style="text-align: center;"> نوی مالک داخلول</h4>

                        </div>
                        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-left text-right">
                            <span id="owner_sign" class="btn btn-md" style="color:black;"><i
                                    class="fa fa-angle-down"></i></span>
                        </div>

                    </div>
                </div>

                <div id="owner_card_body" class="card-body" style="text-align:right;">
                    <form action="{{ route('owner.store') }}" enctype="multipart/form-data" method="post" dir="rtl">
                        @csrf
                        <div class="row">
                            <div class="col-lm-6 col-md-12 col-sm-12 col-xs-12 pull-right">
                                <h5 class="text-center">د مالک شهرت</h5>
                                <div class="form-group form-group-sm">
                                    <label for="owner_code" style="align-content: center;">د مالک خاص نمبر چې هر يو یی باید
                                        په یاد ولري</label>
                                    <input type="text" readonly="readonly" class="form-control" id="owner_code"
                                        value="{{ $max_id }}" name="owner_code" required="required" />
                                </div>
                                <div class="row">
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="name">نوم<span style="color: red"> * </span></label>
                                        <input type="text" placeholder="د  مالک  نوم" class="form-control text-right"
                                            id="name" name="name" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="last_name">تخلص<span style="color: red"> * </span></label>
                                        <input type="text" placeholder="د مالک  تخلص نوم" class="form-control text-right"
                                            id="last_name" name="last_name" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيې۰ئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="father_name">د پلار نوم<span style="color: red"> * </span></label>
                                        <input type="text" placeholder=" د پلار  نوم" class="form-control"
                                            id="father_name" name="father_name" required="required"
                                            pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسشښصضطظعغفقکګلمنڼږهءی۰يېئۍ\s]*"
                                            title="یوازې پښتوالفبا توري داخل کړئ" />
                                    </div>
                                    <div class="form-group form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="grand_fname">د نیکه نوم<span style="color: red"> * </span></label>
                                        <input type="text" placeholder=" د نیکه  نوم" class="form-control"
                                            id="grand_father" required="required" name='grand_fname'
                                            pattern="[آاأبپتټثجحخچڅځدذډرړزؤوږسښشصضطظعغفقکګلمنڼږهءیي۰ېئۍ\s]*"
                                            title="یوازې پښتو الفبا توري داخل کړئ" />
                                    </div>

                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="gender">جنسیت</label>

                                        <select class="form-group form-group-sm col-md-12 col-md-12 col-xs-12"
                                            name="gender" required>
                                            <option value="male">ناریته</option>
                                            <option value="female">ښځینه</option>

                                        </select>

                                    </div>



                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="owner_job">د مالک دنده</label>
                                        <input type="text" value="" placeholder="مالک دنده" class="form-control"
                                            id="owner_job" name="owner_job" required="required"
                                            pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزؤوړږسښشصضطظعغفقکګلمنڼږهءیيېئ۰ۍ\s]*"
                                            title="یوازې الفبا توري داخل کړئ" />
                                    </div>

                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="job_place">د مالک دندي ځای</label>

                                        <input type="text" value="" placeholder="دندي ځای" class="form-control"
                                            id="job_place" name="job_place" />

                                        <label for="house_no">کور نمبر</label>

                                        <input type="text" value="" class="form-control" id=""
                                            name="house_nor" required="required" pattern="[۰-۹]*[0-9]*"
                                            title="یوازې نمبر توري داخل کړئ" />
                                        <div style="color: red;"> {{ $errors->first('house_no') }}</div>

                                        <label for="phone_number">موبایل تمبر </label>
                                        <input type="text" value="" class="form-control" id=""
                                            name="phone_number" required="required" pattern="[۰-۹]*[0-9]*"
                                            title="یوازې نمبر توري داخل کړئ" />
                                        <div style="color: red;"> {{ $errors->first('phone_number') }}</div>





                                        <h5 class="text-center">د مالک اصلی سکونت</h5>
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
                                                name="permenant_dist_add">

                                            </select>
                                        </div>
                                        <div class="form-group form-group-sm">
                                            <label for="permenant_village">کلی</label>

                                            <input type="text" value="" name="permenant_village"
                                                class="form-control" id="vil"
                                                pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*"
                                                title="یوازې الفبا توري داخل کړئ" />



                                        </div>
                                    </div>

                                    <div class="form-group form-group-sm col-md-6 col-sm-6 col-xs-12">
                                        <label for="phone_number">د تذکیرې نمبر</label>
                                        <input type="text" value="" class="form-control" id=""
                                            name="nic_number" required="required" pattern="[۰-۹]*[0-9]*"
                                            title="یوازې نمبر توري داخل کړئ" />
                                        <div style="color: red;"> {{ $errors->first('nic_number') }}</div>



                                        <label for="description">توضیحات<span style="color: red"> * </span></label>
                                        <textarea class="form-control" rows="4" placeholder="توضیحات" name="description" required="required"
                                            id="description"></textarea>
                                        <div style="color:red"> {{ $errors->first('description') }}</div>



                                        <h5 class="text-center">د مالک فعلی سکونت</h5>

                                        <div class="form-group form-group-sm">
                                            <label for="pro2">ولایت</label>
                                            <select class="form-control" id="cur_pro_id" required="required"
                                                name="current_prov_add">
                                                <option class="text-right" value="0">ولایت انتخاب کړئ</option>
                                                @foreach ($provinces as $province)
                                                    <option value="{{ $province->id }}">{{ $province->name }}</option>
                                                @endforeach
                                            </select>
                                            <div style="color:red"> {{ $errors->first('current_prov_add') }}</div>
                                        </div>
                                        <div class="form-group form-group-sm">
                                            <label for="dis2">ولسوالی</label>
                                            <select class="form-control" id="current_dis_add" name="current_dis_add">
                                            </select>
                                        </div>
                                        <div class="form-group form-group-sm">

                                            <div class="form-group form-group-sm">
                                                <label for="permenant_village">کلی</label>

                                                <input type="text" value="۰" name="permenant_village"
                                                    class="form-control" id="vil"
                                                    pattern="[A-Za-z\s]*[آاأبپتټثجحخچڅځدذډرزوؤړږسښشصضطظعغفقکګلمنڼږهءیيېئۍ۰\s]*"
                                                    title="یوازې الفبا توري داخل کړئ" />

                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="row">




                                </div>
                            </div>
                        </div>

                </div>
                <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 pull-right">
                    <h5 class="text-center">عکس اپلوډ &nbsp;<i id="show_documents" class="fa fa-plus"></i></h5>
                    <div class="form-group form-group-sm">
                        <label for="owner_image">د مالک عکس</label>
                        <input id="owner_image" class="form-control" type="file" onchange="loadFile(event)"
                            name="owner_image" />
                        <img id="output" class="img-thumbnail" style="margin-top: 10px;" height="150"
                            width="150" />
                    </div>

                </div>
            </div>
            <div class="text-left">
                <button type = 'submit' class ='btn btn-primary'>ثبت کول</button>

                <input type="reset" class="btn btn-danger btn-md" value=" معلومات لری کول" />

            </div>
            </form>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12">
            <hr style="border-bottom: 2px gray solid;" />
            <h3 class="text-center">ټول مالکان</h3>
            <hr />
        </div>



        <div class="col-lg-12 col-md-12 col-sm-12 table-responsive">
            <style>
                #example tr th,
                #example tr td {
                    text-align: center;

                }
            </style>
            <table id="example" class="table table-striped table-bordered text-right" width="100%" cellspacing="0"
                dir="ltr">
                <thead class="bg-gray">
                    <tr>
                        <th rowspan="2" class="text-center">عملیه</th>
                        <th rowspan="2" class="text-center">تغیر راوستل</th>
                        <th rowspan="2" class="text-center">د ثبت کارمند</th>
                        <th rowspan="2" class="text-center">دوسایطو شمیره</th>
                        <th colspan="3" class="text-center">فعلي سکونت</th>
                        <th colspan="3" class="text-center">اصلی سکونت</th>
                        <th rowspan="2">د مالک عکس</th>
                        <th rowspan="2"> د تلیفون نمبر</th>
                        <th rowspan="2"> د تذکیرې نمبر</th>
                        <th rowspan="2"> دنیکه نوم</th>
                        <th rowspan="2">د پلار نوم</th>
                        <th rowspan="2">تخلص</th>
                        <th rowspan="2">نوم</th>
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
                    @foreach ($get_owners as $owner)
                        @php
                            $per_province = App\Models\Province::where('id', $owner->permenant_prov_add)->get('name');
                            $per_district = App\Models\District::where('id', $owner->permenant_dist_add)->get('name');

                            $cur_province = App\Models\Province::where('id', $owner->current_prov_add)->get('name');
                            $cur_district = App\Models\District::where('id', $owner->current_dist_add)->get('name');

                            $users = App\Models\User::where('id', $owner->user_id)->get('name');

                        @endphp
                        <tr>
                            <td>
                                <button class="btn btn-sm btn-success btn-responsive">
                                    <a href="{{ route('owner.show', $owner->id) }}" style="color:white;">
                                        <i class="fa fa-print"></i> چاپ
                                    </a>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-primary btn-responsive">
                                    <a href="{{ route('owner.edit', $owner) }}" style="color:white;">
                                        <i class="fa fa-edit"></i> تغير راوستل
                                    </a>
                                </button>
                            </td>
                            <td>{{ $users[0]['name'] }}</td>
                            <td>{{ $sumCar = App\Models\Car::where('owner_id', $owner->id)->count('id') }}</td>
                            <td>{{ $owner->current_village }}</td>
                            <td><?= $cur_district[0]['name'] ?></td>
                            <td><?= $cur_province[0]['name'] ?></td>
                            <td>{{ $owner->permenant_village }}</td>
                            <td><?= $per_district[0]['name'] ?></td>
                            <td><?= $per_province[0]['name'] ?></td>
                            <td>
                                <img src="upload/owner/image/{{ $owner->image }}" class="img img-responsive "
                                    height="50" width="50">
                            </td>
                            <td>{{ $owner->phone_number }}</td>
                            <td>{{ $owner->nic_number }}</td>
                            <td>{{ $owner->grand_fname }}</td>
                            <td>{{ $owner->father_name }}</td>
                            <td>{{ $owner->last_name }}</td>
                            <td>{{ $owner->name }}</td>
                            <td>{{ $owner->id }}</td>
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


        $("#frm").css("display", "none");

        $("#show_documents").click(function() {
            $("#frm").slideToggle();
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
