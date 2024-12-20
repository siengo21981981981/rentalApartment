import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { city_sample, type, price, room, floor } from '../../../../data';
import { roomInfo } from '../../../shared/models/roomInfo';
import { RentalItemService } from '../../../services/rental-item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrl: './rent.component.scss',
})
export class RentComponent implements OnInit {
  city: TreeNode<string>[] = city_sample;
  type: string[] = type;
  price: TreeNode<Array<number>>[] = price;
  room: TreeNode<number>[] = room;
  floor: TreeNode<Array<number>>[] = floor;

  searchForm!: FormGroup;
  selectedNodes: any;
  ccity: string | undefined;
  ishidden = true;
  resultItem: roomInfo[] = [];
  filteredPriceType: any = [];
  filteredFloorType: any;
  constructor(
    private fb: FormBuilder,
    private rental: RentalItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resultItem = history.state.result || [];
    this.searchForm = this.fb.group({
      searchBar: [''],
      searchCity: [''],
      searchType: [''],
      searchPrice: [''],
      searchRoom: [''],
      searchFloor: [''],
    });
  }

  onSubmit() {
    let {
      searchCity,
      searchType,
      searchPrice,
      searchRoom,
      searchFloor,
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

    if (searchFloor) {
      this.filteredFloorType = searchFloor
        .filter((node: { children: any }) => !node.children)
        .map((node: { data: any }) => node.data);

      // 如果有篩選過的樓層數組，設定為 searchFloor
      if (this.filteredFloorType.length > 0) {
        searchFloor = this.filteredFloorType[1]; // 假設每個項目都是數組，取第一項
      }
      console.log('filteredFloorType', this.filteredFloorType); // 確認處理結果
    }

    if (searchRoom) {
      searchRoom = searchRoom[0].data;
    }

    const query: any = [
      {
        city: selectedCity,
        district: selectedDistricts,
        type: searchType,
        rent: this.filteredPriceType,
        room: searchRoom,
        floor: this.filteredFloorType,
        keyword: searchBar,
      },
    ];

    // 呼叫 API 或其他邏輯
    this.rental.getRoomResult(query).subscribe({
      next: (result) => {
        this.resultItem = result;
        this.router.navigate([], { queryParams: { result: this.resultItem } });
      },
      error: (err) => {
        this.router.navigate([], { queryParams: { result: [] } });
      },
    });
  }
}
