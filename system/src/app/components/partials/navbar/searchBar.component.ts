import { Component, OnInit } from '@angular/core';
import { city_sample } from '../../../../data';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { RentalItemService } from '../../../services/rental-item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { roomInfo } from '../../../shared/models/roomInfo';

@Component({
  selector: 'app-searchBar',
  templateUrl: './searchBar.component.html',
  styleUrl: './searchBar.component.scss',
})
export class searchBarComponent implements OnInit {
  city: TreeNode<any>[] = city_sample;
  type: string[] = [
    '整層住家',
    '獨立套房',
    '分租套房',
    '分租雅房',
    '雅房',
    '店面',
    '住辦',
    '商用',
    '廠房',
    '車位',
    '土地',
  ];
  price: TreeNode<Array<number>>[] = [
    {
      label: '5000元以下',
      data: [0, 5000],
    },
    {
      label: '5000元 - 10000元',
      data: [5000, 10000],
    },
    {
      label: '10000元 - 20000元',
      data: [10000, 20000],
    },
    {
      label: '20000元以上',
      data: [20000, 100000],
    },
  ];
  result: roomInfo[] = [];
  searchForm!: FormGroup;
  selectedNodes: any;
  filteredPriceType: any;

  constructor(
    private fb: FormBuilder,
    private rental: RentalItemService,
    private router: Router,
    
  ) {}
  
  ngOnInit(): void {
    console.log(this.city);
    
    this.searchForm = this.fb.group({
      searchBar: [''],
      searchCity: [''],
      searchType: [''],
      searchPrice: [''],
    });
  }
  onSubmit() {
    let {
      searchCity,
      searchType,
      searchPrice,
      searchBar,
    } = this.searchForm.value;

    let selectedCity = '';
    let selectedDistricts: string[] = [];

    // 確保 searchCity 存在且為數組
    if (searchCity && Array.isArray(searchCity)) {
      // 獲取選中的主要城市（假設選中的節點具有 parent 屬性）
      const selectedCityNode = searchCity.find((node) => !node.parent);

      // 找到主要城市的節點
      if (selectedCityNode) {
        selectedCity = selectedCityNode.label;
        console.log('selectedCity', selectedCity);
      }

      // 篩選有 children 的城市節點並展開所有子區域
      selectedDistricts = searchCity
        .filter((node) => node.children) // 篩選出有 children 的節點（城市）
        .flatMap((node) => node.children) // 展開所有子節點（即區域）
        .map((childNode) => childNode.data); // 提取區域的名稱（data）

      // 將不含 children 的區域節點也加入
      selectedDistricts.push(
        ...searchCity
          .filter((node) => !node.children) // 過濾掉父節點，僅選擇子節點
          .map((node) => node.data) // 提取區域的 data 屬性
      );

      console.log('selectedDistricts', selectedDistricts);
    }

    if (searchPrice) {
      this.filteredPriceType = searchPrice
        .filter((node: { children: any }) => !node.children)
        .map((node: { data: any }) => node.data);

      // 如果有篩選過的價格數組，設定為 searchPrice
      if (this.filteredPriceType.length > 0) {
        searchPrice = this.filteredPriceType[0]; // 假設每個項目都是數組，取第一項
      }
      console.log('filteredPriceType', this.filteredPriceType); // 確認處理結果
    }

   
    const query: any = [
      {
        city: selectedCity,
        district: selectedDistricts,
        type: searchType,
        rent: this.filteredPriceType,
        room: '',
        floor: '',
        keyword: searchBar,
      },
    ];

    // 呼叫 API 或其他邏輯
    this.rental.getRoomResult(query).subscribe({
      next: (result) => {
        this.result = result;
        this.router.navigate(['/rent'], { state: { result: this.result } });
      },
      error: (err) => {
        this.router.navigate(['/rent'], { state: { result: [] } });
      },
    });
  } 
  }

